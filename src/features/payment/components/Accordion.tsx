import { useState } from "react";

interface AccordionProps {
  items: { id: string; title: string; content: React.ReactNode }[];
}

const Accordion = ({ items }: AccordionProps) => {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="divide-y rounded border">
      {items.map((it) => (
        <div key={it.id}>
          <button
            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex justify-between items-center"
            onClick={() => setOpen((o) => (o === it.id ? null : it.id))}
            aria-expanded={open === it.id}
          >
            <span className="font-medium">{it.title}</span>
            <span className="text-sm text-gray-500">
              {open === it.id ? "−" : "+"}
            </span>
          </button>
          {open === it.id && (
            <div className="px-4 py-3 text-sm text-gray-700">{it.content}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
