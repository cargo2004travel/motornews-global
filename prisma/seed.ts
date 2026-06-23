import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { sources } from "../src/config/sources";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`Semeando ${sources.length} fontes…`);
  for (const s of sources) {
    await prisma.source.upsert({
      where: { url: s.url },
      create: {
        name: s.name,
        url: s.url,
        rssUrl: s.rssUrl,
        country: s.country,
        language: s.language,
        category: s.category,
        active: s.active,
      },
      update: {
        rssUrl: s.rssUrl,
        active: s.active,
      },
    });
  }
  console.log("Fontes semeadas com sucesso.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
