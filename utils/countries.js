export const COUNTRIES = [
  { code: "+91", name: "India", flag: "🇮🇳", digits: 10 },
  { code: "+1", name: "USA/Canada", flag: "🇺🇸", digits: 10 },
  { code: "+44", name: "UK", flag: "🇬🇧", digits: 10 },
  { code: "+971", name: "UAE", flag: "🇦🇪", digits: 9 },
  { code: "+65", name: "Singapore", flag: "🇸🇬", digits: 8 },
  { code: "+61", name: "Australia", flag: "🇦🇺", digits: 9 },
];

const ISO_TO_CODE = {
  IN: "+91",
  US: "+1",
  CA: "+1",
  GB: "+44",
  AE: "+971",
  SG: "+65",
  AU: "+61",
};

export function getCountry(code) {
  return COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];
}

export function isIndia(code) {
  return code === "+91";
}

export async function detectCountryCode() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    return ISO_TO_CODE[data?.country_code] || "+91";
  } catch {
    return "+91";
  }
}
