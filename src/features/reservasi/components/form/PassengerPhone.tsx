import { formatChunks4 } from "../../utils/validation";

interface PassengerPhoneInputProps {
  seatId: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

const PassengerPhoneInput = ({
  value,
  onChange,
  error,
  inputRef,
}: PassengerPhoneInputProps) => {
  const local = value.replace(/^\+?62/, "");
  const masked = formatChunks4(local);
  return (
    <div className="flex items-center border rounded">
      <span className="px-3 py-2 text-gray-700 select-none border-r">+62</span>
      <input
        ref={inputRef}
        type="tel"
        className={`flex-1 px-3 py-2 rounded-r ${
          error ? "border-red-500" : ""
        }`}
        inputMode="tel"
        placeholder="8123-4567-890"
        value={masked}
        onChange={(e) => onChange(`+62${e.target.value.replace(/\D/g, "")}`)}
        aria-invalid={!!error}
      />
    </div>
  );
};

export default PassengerPhoneInput;
