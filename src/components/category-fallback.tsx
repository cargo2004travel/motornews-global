import { categoryColor, needsLightText } from "@/lib/category-visual";

/**
 * Imagem de fallback exibida quando a notícia não trouxe foto própria/og:image.
 * Em vez de hotlinkar fotos de terceiros sem permissão, mostramos um cartão
 * estilizado com a cor e o nome da categoria.
 */
export function CategoryFallback({
  category,
  className,
  textSize = "text-sm",
}: {
  category: string;
  className?: string;
  textSize?: string;
}) {
  const color = categoryColor(category);
  const light = needsLightText(color);

  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className ?? ""}`}
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
      }}
    >
      <span
        className={`px-3 text-center font-headline font-bold uppercase tracking-wide ${textSize} ${
          light ? "text-white" : "text-foreground"
        }`}
      >
        {category}
      </span>
    </div>
  );
}
