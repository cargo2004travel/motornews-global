import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatRelative(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: ptBR });
}

export function formatFullDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
}
