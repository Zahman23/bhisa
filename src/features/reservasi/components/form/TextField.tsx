interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helper?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

const TextField = (props: TextFieldProps) => {
  const {
    id,
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    required,
    error,
    helper,
    inputRef,
  } = props;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm">
        {label}
        {required && " *"}
      </label>
      <input
        ref={inputRef}
        id={id}
        type={type}
        className={`w-full border rounded px-3 py-2 ${
          error ? "border-red-500" : ""
        }`}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={helper ? `${id}-help` : undefined}
      />
      {helper && (
        <p id={`${id}-help`} className="text-xs text-gray-500">
          {helper}
        </p>
      )}
      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default TextField;
