interface TermsPreviewProps {
  checked: boolean;
  onChange: (v: boolean) => void;
}

const TermsPreview = ({ checked, onChange }: TermsPreviewProps) => {
  return (
    <div>
      <div className="text-sm text-gray-600">
        Tiket tidak dapat dipindahtangankan. Perubahan jadwal mengikuti
        ketersediaan. Pembatalan mengikuti kebijakan operator.
        <button
          type="button"
          className="ml-1 underline text-blue-600"
          onClick={() => alert("S&K lengkap…")}
          aria-haspopup="dialog"
        >
          Lihat Selengkapnya
        </button>
      </div>
      <label className="inline-flex items-center gap-2 text-sm mt-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>Saya menyetujui S&K</span>
      </label>
    </div>
  );
};

export default TermsPreview;
