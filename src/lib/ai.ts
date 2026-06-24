import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { CATEGORIES } from "@/config/taxonomy";

const SYSTEM_PROMPT = `Você é um editor de notícias especializado em automobilismo e motociclismo. Receberá título, fonte, idioma, trecho e URL original. Gere um título em português do Brasil, um resumo jornalístico original de até 700 caracteres, uma chamada curta de até 180 caracteres, categoria, campeonato, país, tags e descrição SEO. Não copie o texto original. Não invente fatos.`;

const categoryNames = CATEGORIES.map((c) => c.name) as [string, ...string[]];

const AiResultSchema = z.object({
  translatedTitle: z.string().max(180),
  summary: z.string().max(700),
  excerpt: z.string().max(180),
  category: z.enum(categoryNames),
  championship: z.string().nullable(),
  country: z.string(),
  tags: z.array(z.string()).max(6),
  seoTitle: z.string().max(70),
  seoDescription: z.string().max(160),
});

export type AiResult = z.infer<typeof AiResultSchema>;

export interface RawArticleInput {
  title: string;
  sourceName: string;
  sourceCountry: string;
  language: string;
  excerpt: string;
  url: string;
}

/**
 * Usa a OpenRouter (compatível com a API da OpenAI) como provedor padrão, já que
 * permite trocar de modelo/billing sem mudar código. Cai para a OpenAI direta se
 * só OPENAI_API_KEY estiver configurada.
 */
const AI_MODEL = process.env.OPENROUTER_API_KEY ? "openai/gpt-4o-mini" : "gpt-4o-mini";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (process.env.OPENROUTER_API_KEY) {
    if (!client) {
      client = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
      });
    }
    return client;
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Configure OPENROUTER_API_KEY ou OPENAI_API_KEY");
  }
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

export async function processArticleWithAi(input: RawArticleInput): Promise<AiResult> {
  const openai = getClient();

  const completion = await openai.chat.completions.parse({
    model: AI_MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: JSON.stringify({
          titulo: input.title,
          fonte: input.sourceName,
          paisFonte: input.sourceCountry,
          idiomaOriginal: input.language,
          trecho: input.excerpt,
          urlOriginal: input.url,
        }),
      },
    ],
    response_format: zodResponseFormat(AiResultSchema, "article_summary"),
    temperature: 0.4,
  });

  const parsed = completion.choices[0]?.message.parsed;
  if (!parsed) {
    throw new Error("IA não retornou um resultado válido");
  }
  return parsed;
}
