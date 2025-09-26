import { formatChunks4 } from "../../utils/validation";

interface PhoneInputProps {
  id: string;
  label: string;
  value?: string;
  onChange: (v: string) => void;
  error?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

const PhoneInput = ({
  id,
  label,
  value,
  onChange,
  error,
  inputRef,
}: PhoneInputProps) => {
  const local = value?.replace(/^\+?62/, "");
  const masked = formatChunks4(local ?? "");
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "");
    onChange(`+62${digits}`);
  }
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm">
        {label} *
      </label>
      <div
        className={`flex items-center border rounded ${
          error ? "border-red-500" : ""
        }`}
      >
        <span className="px-3 py-2 text-gray-700 select-none border-r">
          +62
        </span>
        <input
          ref={inputRef}
          id={id}
          type="tel"
          className="flex-1 px-3 py-2 rounded-r"
          inputMode="tel"
          placeholder="8123-4567-890"
          value={masked}
          onChange={handleChange}
          aria-invalid={!!error}
        />
      </div>
      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default PhoneInput;
