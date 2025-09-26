import { useState } from "react";
import { maskMid, split4 } from "../utils/validation.";

interface CopyFieldProps {
  label: string;
  value: string;
}

const CopyField = ({ label, value }: CopyFieldProps) => {
  const [focus, setFocus] = useState(false);
  const display = focus ? split4(value) : maskMid(value);
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <input
          className="border rounded px-3 py-2 w-full"
          readOnly
          value={display}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
        <button
          className="border rounded px-3 py-2"
          onClick={async () => {
            await navigator.clipboard.writeText(value.replace(/\s/g, ""));
          }}
        >
          Salin
        </button>
      </div>
    </div>
  );
};

export default CopyField;
