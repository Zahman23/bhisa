export const maskMid = (s: string) => {
  const clean = s.replace(/\s/g, "");
  if (clean.length <= 8) return clean.replace(/.(?=.{4})/g, "•");
  return (
    clean.slice(0, 4) + clean.slice(4, -4).replace(/./g, "•") + clean.slice(-4)
  );
};
export const split4 = (s: string) =>
  s
    .replace(/\s/g, "")
    .match(/.{1,4}/g)
    ?.join(" ") ?? "";
