/**
 * Order form validation, shared by the order page (instant feedback) and the /api/order routes (the
 * authority). The site never collects SSN, date of birth, card or bank details: requests carrying such
 * fields, or values that look like them, are refused before anything is sent on, and the values are
 * never echoed back or logged.
 */

export const US_STATES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado", CT: "Connecticut",
  DE: "Delaware", DC: "District of Columbia", FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois",
  IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana",
  NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
  NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah",
  VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

// Same key pattern the order automation refuses (att_order_automation._SENSITIVE_KEY_RE).
const SENSITIVE_KEY_RE = /ssn|social|tax_?id|dob|birth|card|cvv|cvc|expir|account|routing|bank|iban|\bpin\b|password|passcode/i;
const SSN_VALUE_RE = /(?<!\d)\d{3}[- ]\d{2}[- ]\d{4}(?!\d)|(?<!\d)\d{9}(?!\d)/;
const DATE_VALUE_RE = /(?<!\d)(0?[1-9]|1[0-2])[/.-](0?[1-9]|[12]\d|3[01])[/.-](19|20)?\d{2}(?!\d)/;
const CARD_CANDIDATE_RE = /(?<!\d)(?:\d[ -]?){12,18}\d(?!\d)/g;
/** Strictly formatted fields that are validated on their own (and would trip the value patterns). */
const VALUE_SCAN_SKIP = new Set(["phone", "zip", "email", "requestId", "quoteJobId", "jobId"]);

function luhn(digits: string): boolean {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (alt) d = d * 2 > 9 ? d * 2 - 9 : d * 2;
    sum += d;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function looksSensitive(text: string): boolean {
  if (SSN_VALUE_RE.test(text) || DATE_VALUE_RE.test(text)) return true;
  return [...text.matchAll(CARD_CANDIDATE_RE)].some((m) => luhn(m[0].replace(/\D/g, "")));
}

/** Key paths carrying (or named like) SSN, date of birth, card or bank data. Values are never returned. */
export function sensitivePaths(value: unknown, path = ""): string[] {
  if (Array.isArray(value)) return value.flatMap((v, i) => sensitivePaths(v, `${path}[${i}]`));
  if (!value || typeof value !== "object") return [];
  const hits: string[] = [];
  for (const [k, v] of Object.entries(value)) {
    const p = path ? `${path}.${k}` : k;
    if (SENSITIVE_KEY_RE.test(k)) hits.push(p);
    else if (typeof v === "string" && !VALUE_SCAN_SKIP.has(k) && looksSensitive(v)) hits.push(p);
    else hits.push(...sensitivePaths(v, p));
  }
  return hits;
}

const SENSITIVE_MESSAGE = "Please do not enter Social Security, date of birth, card or bank details here.";

export interface AddressInput {
  street: string;
  unit: string;
  city: string;
  state: string;
  zip: string;
}

export interface CustomerInput {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  billingLanguage: "english" | "spanish" | "";
  /** Answer to "may we reach you by phone or text about installation, billing and service?" */
  contactByPhone: "yes" | "no" | "";
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const clean = (s: unknown) => (typeof s === "string" ? s.trim().replace(/\s+/g, " ") : "");

export function phoneDigits(phone: string): string {
  const d = phone.replace(/\D/g, "");
  return d.length === 11 && d.startsWith("1") ? d.slice(1) : d;
}

export function validateAddress(raw: Partial<AddressInput>): { value: AddressInput; errors: FieldErrors<AddressInput> } {
  const value: AddressInput = {
    street: clean(raw.street),
    unit: clean(raw.unit),
    city: clean(raw.city),
    state: clean(raw.state).toUpperCase(),
    zip: clean(raw.zip),
  };
  const errors: FieldErrors<AddressInput> = {};
  if (value.street.length < 3 || value.street.length > 80 || !/\d/.test(value.street) || !/[A-Za-z]/.test(value.street))
    errors.street = "Enter the street address, including the house or building number.";
  if (value.unit && !/^[A-Za-z0-9 #.-]{1,20}$/.test(value.unit)) errors.unit = "Enter the apartment or unit number using letters and numbers only.";
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' .-]{2,40}$/.test(value.city)) errors.city = "Enter the city.";
  if (!US_STATES[value.state]) errors.state = "Select the state.";
  if (!/^\d{5}$/.test(value.zip)) errors.zip = "Enter a 5-digit ZIP code.";
  for (const k of ["street", "unit", "city"] as const) if (!errors[k] && value[k] && looksSensitive(value[k])) errors[k] = SENSITIVE_MESSAGE;
  return { value, errors };
}

export function validateCustomer(raw: Partial<CustomerInput>): { value: CustomerInput; errors: FieldErrors<CustomerInput> } {
  const value: CustomerInput = {
    firstName: clean(raw.firstName),
    lastName: clean(raw.lastName),
    phone: clean(raw.phone),
    email: clean(raw.email).toLowerCase(),
    billingLanguage: raw.billingLanguage === "english" || raw.billingLanguage === "spanish" ? raw.billingLanguage : "",
    contactByPhone: raw.contactByPhone === "yes" || raw.contactByPhone === "no" ? raw.contactByPhone : "",
  };
  const errors: FieldErrors<CustomerInput> = {};
  const name = /^[A-Za-zÀ-ÖØ-öø-ÿ' .-]{2,40}$/;
  if (!name.test(value.firstName)) errors.firstName = "Enter your first name (at least 2 letters).";
  if (!name.test(value.lastName)) errors.lastName = "Enter your last name (at least 2 letters).";
  const digits = phoneDigits(value.phone);
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(digits)) errors.phone = "Enter a 10-digit US phone number.";
  if (value.email.length > 254 || !/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[A-Za-z]{2,}$/.test(value.email)) errors.email = "Enter a valid email address.";
  if (!value.billingLanguage) errors.billingLanguage = "Select a billing language.";
  if (!value.contactByPhone) errors.contactByPhone = "Select your contact preference.";
  return { value, errors };
}

/** Option answers: group key → true / false / the title of a choice the portal offered. */
export type OptionAnswers = Record<string, boolean | string>;

export function validOptionAnswers(raw: unknown): raw is OptionAnswers {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return false;
  const entries = Object.entries(raw);
  return (
    entries.length <= 12 &&
    entries.every(
      ([k, v]) =>
        /^[a-z][a-z0-9_]{1,40}$/.test(k) && (typeof v === "boolean" || (typeof v === "string" && v.length > 0 && v.length <= 160)),
    )
  );
}

export const isRequestId = (s: unknown): s is string => typeof s === "string" && /^[A-Za-z0-9_-]{16,80}$/.test(s);
export const isJobId = (s: unknown): s is string => typeof s === "string" && /^[A-Za-z0-9_-]{16,64}$/.test(s);

/** Exact key set check: refuses unknown and missing keys (like the automation's extra="forbid"). */
export function hasExactKeys(obj: unknown, keys: string[]): obj is Record<string, unknown> {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;
  const have = Object.keys(obj);
  return have.length === keys.length && keys.every((k) => have.includes(k));
}
