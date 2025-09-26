// src/components/BackButton.tsx
// atau pakai icon lain
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { type PropsWithChildren } from "react";

type BackButtonProps = PropsWithChildren<{
  fallbackTo?: string; // ke mana kalau tidak ada history
  className?: string;
  label?: string;
  replace?: boolean; // gunakan replace saat fallback
}>;

export const BackButton = ({
  fallbackTo = "/",
  className = "",
  label = "Kembali",
  replace = true,
  children,
}: BackButtonProps) => {
  const navigate = useNavigate();

  const goBack = () => {
    // ada riwayat? (SPA: length>2 biasanya aman; referrer sebagai cadangan)
    if (window.history.length > 2 || document.referrer) {
      navigate(-1);
    } else {
      navigate(fallbackTo, { replace });
    }
  };

  return (
    <button
      onClick={goBack}
      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 border hover:bg-black/5 ${className}`}
      aria-label="Kembali"
    >
      <ArrowLeft className="h-5 w-5" />
      {children ?? <span className="text-sm">{label}</span>}
    </button>
  );
};
