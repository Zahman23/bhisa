import React, { useState } from "react";

export function SummaryDrawer({
  triggerLabel = "Ringkasan",
  children,
}: {
  triggerLabel?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Tombol hanya tampil < lg */}
      <div className="lg:hidden sticky top-0 right-0">
        <button
          onClick={() => setOpen(true)}
          className="cursor-pointer border rounded px-3 py-2"
          aria-expanded={open}
        >
          Ringkasan
        </button>
      </div>

      {/* Overlay fullscreen super simpel */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex flex-col bg-white overflow-hidden">
          <header className="sticky top-0 flex items-center justify-between border-b p-3">
            <h3 className="text-base font-semibold">{triggerLabel}</h3>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md border px-3 py-1 text-sm hover:bg-black/5"
              aria-label="Tutup"
            >
              Tutup
            </button>
          </header>
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        </div>
      )}
    </>
  );
}
