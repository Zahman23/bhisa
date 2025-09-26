import { useEffect, useState } from "react";

const useCountdown = (deadline?: number) => {
  const [, force] = useState(0);
  useEffect(() => {
    const t = setInterval(() => force((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);
  if (!deadline) return { expired: false, mm: "00", ss: "00" };
  const now = Date.now();
  const remain = Math.max(0, deadline - now);
  const expired = remain <= 0;
  const m = Math.floor(remain / 60000);
  const s = Math.floor((remain % 60000) / 1000);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return { expired, mm: pad(m), ss: pad(s) };
};

export default useCountdown;
