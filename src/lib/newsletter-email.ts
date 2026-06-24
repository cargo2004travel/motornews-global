import { SITE_NAME, SITE_URL } from "@/config/site";

interface NewsletterArticle {
  slug: string;
  translatedTitle: string;
  excerpt: string;
  category: string;
}

export function buildNewsletterHtml(articles: NewsletterArticle[], unsubscribeUrl: string): string {
  const rows = articles
    .map(
      (a) => `
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid #e5e5e5;">
          <span style="display:inline-block;background:#E10600;color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;padding:2px 8px;border-radius:4px;margin-bottom:8px;">${escapeHtml(a.category)}</span>
          <div>
            <a href="${SITE_URL}/noticias/${a.slug}" style="font-size:17px;font-weight:700;color:#111111;text-decoration:none;line-height:1.3;">
              ${escapeHtml(a.translatedTitle)}
            </a>
          </div>
          <p style="margin:6px 0 0;font-size:14px;color:#555555;line-height:1.4;">${escapeHtml(a.excerpt)}</p>
          <a href="${SITE_URL}/noticias/${a.slug}" style="font-size:13px;color:#0057FF;text-decoration:none;font-weight:600;">Ler matéria completa →</a>
        </td>
      </tr>`,
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <body style="margin:0;background:#F5F5F5;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;">
      <tr>
        <td style="padding:20px 24px;border-bottom:2px solid #111111;">
          <a href="${SITE_URL}" style="font-size:20px;font-weight:800;color:#111111;text-decoration:none;">
            Motor<span style="color:#E10600;">News</span> Global
          </a>
          <div style="margin-top:4px;">
            <a href="${SITE_URL}" style="font-size:12px;color:#555555;text-decoration:none;">Ver site completo →</a>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px 0;">
          <h1 style="font-size:18px;margin:0 0 4px;color:#111111;">As principais notícias de hoje</h1>
          <p style="font-size:13px;color:#555555;margin:0 0 8px;">Automobilismo e motociclismo, resumido para você.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px;">
          <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
        </td>
      </tr>
      <tr>
        <td style="padding:24px;text-align:center;font-size:11px;color:#999999;">
          <p>Você está recebendo este e-mail porque assinou a newsletter do ${SITE_NAME}.</p>
          <p><a href="${unsubscribeUrl}" style="color:#999999;">Cancelar inscrição</a> · <a href="${SITE_URL}/privacidade" style="color:#999999;">Política de Privacidade</a></p>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
