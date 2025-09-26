// src/features/payment/utils/copy.ts
export async function copyText(s: string) {
  try {
    await navigator.clipboard.writeText(s);
    return true;
  } catch {
    // fallback lama
    const ta = document.createElement("textarea");
    ta.value = s;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e: unknown) {
      console.log(e as Error);
    }
    document.body.removeChild(ta);
    return ok;
  }
}
