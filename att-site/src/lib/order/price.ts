/** "$12/mo.", "-$10 /mo.", "$65.00", "Included", "$0" -> dollars (Included and blanks are 0). */
export function amount(charge: string): number {
  const m = /(-)?\$\s*([\d,]+(?:\.\d{1,2})?)/.exec(charge);
  return m ? (m[1] ? -1 : 1) * Number(m[2].replace(/,/g, "")) : 0;
}

export const money = (n: number) => `$${n.toFixed(2)}`;
