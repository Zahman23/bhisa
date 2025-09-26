interface SeatButtonProps {
  id: string;
  taken: boolean;
  selected: boolean;
  onToggle: () => void;
}

const SeatButton = ({ id, taken, selected, onToggle }: SeatButtonProps) => {
  return (
    <button
      type="button"
      className={`h-10 rounded border text-sm 
        ${
          taken
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : selected
            ? "bg-green-200"
            : "bg-white hover:bg-gray-50"
        }`}
      disabled={taken}
      onClick={onToggle}
      role="checkbox"
      aria-checked={selected}
      aria-label={`Kursi ${id}${
        taken ? " (sudah terisi)" : selected ? " (terpilih)" : ""
      }`}
      tabIndex={taken ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      {id}
    </button>
  );
};

export default SeatButton;
