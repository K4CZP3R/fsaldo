export function valuta(value: number): string {
  // Get current locale
  return value.toLocaleString(window.navigator.language, {
    style: "currency",
    currency: "EUR",
  });
}

export function date(value: Date): string {
  // Get current locale
  return value.toLocaleDateString(window.navigator.language);
}

export function strDate(value: string): string {
  // Get current locale
  return new Date(value).toLocaleDateString(window.navigator.language);
}
