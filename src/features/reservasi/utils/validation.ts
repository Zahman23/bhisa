export const formatChunks4 = (digits: string) =>
  digits
    .replace(/\D/g, "")
    .match(/.{1,4}/g)
    ?.join("-") ?? "";
export const waValid = (v: string) =>
  /^(\+?\d){10,}$/.test(v.replace(/\s|-/g, ""));
export const emailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
