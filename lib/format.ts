export function countryFlag(countryCode?: string | null): string {
  const code = String(countryCode || "").trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return "";
  return String.fromCodePoint(...[...code].map((letter) => 127397 + letter.charCodeAt(0)));
}
export function profileLocation(countryCode?:string|null, city?:string|null, region?:string|null):string {
  return [countryFlag(countryCode), city, region].filter(Boolean).join(" · ");
}
