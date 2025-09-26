interface CouponFieldProps {
  value: string;
  onChange: (v: string) => void;
  onApply: () => void;
  onRemove: () => void;
  error?: string;
  active?: string;
}

const CouponField = ({
  value,
  onChange,
  onApply,
  onRemove,
  error,
  active,
}: CouponFieldProps) => {
  const hasActive = !!active && !error;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="coupon" className="text-sm">
        Kupon
      </label>
      <div className="flex gap-2">
        <input
          id="coupon"
          className="border rounded px-3 py-2"
          value={value}
          placeholder="Masukkan kode (cth: DISC10)"
          onChange={(e) => onChange(e.target.value)}
          disabled={hasActive}
        />
        {!hasActive ? (
          <button
            type="button"
            className="border rounded px-3 py-2"
            onClick={onApply}
          >
            Terapkan
          </button>
        ) : (
          <button
            type="button"
            className="border rounded px-3 py-2"
            onClick={onRemove}
          >
            Hapus
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
      {hasActive && (
        <p className="text-xs text-emerald-600">Kupon {active} aktif</p>
      )}
    </div>
  );
};

export default CouponField;
