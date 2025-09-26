// src/features/reserve/pages/ReservationPage.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReservationStore } from "../features/reservasi/stores/reservasiStore";
import { useCountdown } from "../features/reservasi/hooks/useCountdown";

import Container from "../components/container";
import { emailValid, waValid } from "../features/reservasi/utils/validation";
import TextField from "../features/reservasi/components/form/TextField";
import PhoneInput from "../features/reservasi/components/form/PhoneInput";
import SeatButton from "../features/reservasi/components/form/SeatButton";
import PassengerPhoneInput from "../features/reservasi/components/form/PassengerPhone";
import CouponField from "../features/reservasi/components/CouponField";
import TermsPreview from "../features/reservasi/components/TermsPreview";
import Toast from "../components/global/ToastHost";
import { BackButton } from "../components/BackButton";
import { SummaryDrawer } from "../components/SummaryDrawer";
import Ringkasan from "../features/reservasi/components/RIngkasan";

export default function ReservationPage() {
  const nav = useNavigate();

  const {
    dep,
    seats,
    selectedSeats,
    passengers,
    contact,
    coupon,
    termsAccepted,
    deadline,
    // totalBefore,
    // discount,
    // totalAfter,
    errors,
    hydrate,
    toggleSeat,
    setPassengerName,
    setContact,
    setTerms,
    applyCoupon,
    removeCoupon,
    validateAll,
    placeOrder,
    setPassengerPhone,
  } = useReservationStore();

  // hydrate & rebuild from URL if needed
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  // desktop-first container

  // countdown
  const { expired, mm, ss } = useCountdown(deadline);
  const countdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (expired) countdownRef.current?.focus();
  }, [expired]);

  // local ui states
  const [couponInput, setCouponInput] = useState(coupon.code ?? "");
  const [toast, setToast] = useState<{
    msg: string;
    type?: "error" | "success";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // focus refs
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const waRef = useRef<HTMLInputElement>(null);
  const seatGridRef = useRef<HTMLDivElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const paxNameRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const paxPhoneRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // realtime validations
  const nameErr = contact.nama.trim() ? "" : "Nama pemesan wajib diisi.";
  const emailErr = emailValid(contact.email) ? "" : "Email tidak valid.";
  const waErr = waValid(contact.whatsapp) ? "" : "Nomor WhatsApp tidak valid.";
  const paxNameMissing = passengers.find((p) => !p.nama.trim());
  const paxPhoneMissing = passengers.find((p) => !waValid(p.phone));

  function focusFirstError() {
    if (!selectedSeats.length) {
      seatGridRef.current?.focus();
      return;
    }
    if (paxNameMissing) {
      paxNameRefs.current[paxNameMissing.seat]?.focus();
      return;
    }
    if (paxPhoneMissing) {
      paxPhoneRefs.current[paxPhoneMissing.seat]?.focus();
      return;
    }
    if (nameErr) {
      nameRef.current?.focus();
      return;
    }
    if (emailErr) {
      emailRef.current?.focus();
      return;
    }
    if (waErr) {
      waRef.current?.focus();
      return;
    }
    if (!termsAccepted) {
      termsRef.current?.focus();
      return;
    }
    if (expired) {
      seatGridRef.current?.focus();
      return;
    }
  }

  function onApplyCoupon() {
    applyCoupon(couponInput);
    setToast({
      msg: couponInput
        ? coupon.error
          ? "Kupon tidak valid"
          : "Kupon diterapkan"
        : "Kupon dihapus",
      type: coupon.error ? "error" : "success",
    });
    setTimeout(() => setToast(null), 2200);
  }
  function onRemoveCoupon() {
    setCouponInput("");
    removeCoupon();
    setToast({ msg: "Kupon dihapus", type: "success" });
    setTimeout(() => setToast(null), 1500);
  }

  async function onSubmit() {
    if (
      !selectedSeats.length ||
      paxNameMissing ||
      paxPhoneMissing ||
      !!nameErr ||
      !!emailErr ||
      !!waErr ||
      !termsAccepted ||
      expired
    ) {
      focusFirstError();
      return;
    }
    validateAll();
    setIsSubmitting(true);
    const r = placeOrder();

    if (!r.ok) {
      setToast({ msg: r.message ?? "Terjadi kesalahan.", type: "error" });
      setTimeout(() => setToast(null), 2500);
      focusFirstError();
      return;
    }

    setToast({
      msg: "Booking berhasil! Mengarahkan ke pembayaran…",
      type: "success",
    });
    const sp = new URLSearchParams({
      orderId: r.orderId || "",
    });
    setTimeout(
      () => nav({ pathname: "/payment", search: `?${sp.toString()}` }),
      800
    );

    setIsSubmitting(false);
    try {
      localStorage.removeItem("bhisa.reserve.current");
    } catch {
      setToast({
        msg: "",
      });
    }
  }

  return (
    <Container title="Bhisa Shuttle" description="Reserve">
      <div className="sticky top-0 lg:relative bg-white lg:block py-2 flex justify-between">
        <BackButton />
        <SummaryDrawer>
          <Ringkasan
            className="space-y-3"
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            aria="summary mobile"
          />
        </SummaryDrawer>
      </div>
      <div className="grid grid-cols-12 gap-6 py-6">
        {/* LEFT */}
        <section className="col-span-12 lg:col-span-8 space-y-6">
          {/* Ringkasan + Countdown */}
          <section aria-labelledby="ringkasan">
            <div className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h1 id="ringkasan" className="text-2xl font-semibold">
                  {dep?.operator ?? "-"}
                </h1>
                <p className="text-sm">
                  {dep?.origin} → {dep?.destination} • {dep?.tanggal}
                </p>
                <p className="text-sm">
                  {dep?.berangkat} → {dep?.tiba} • {dep?.durasiMenit} mnt
                </p>
              </div>
              <div
                ref={countdownRef}
                tabIndex={-1}
                className={`text-center px-3 py-2 rounded ${
                  expired
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                }`}
                aria-live="polite"
              >
                <div className="text-xs">Selesaikan dalam</div>
                <div className="font-mono text-xl">
                  {mm}:{ss}
                </div>
              </div>
            </div>
          </section>

          {/* Form Pemesan */}
          <section aria-labelledby="pemesan">
            <form
              className="border rounded p-4 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              <h2 id="pemesan" className="text-xl font-semibold">
                Data Pemesan
              </h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <TextField
                    id="pemesan-nama"
                    label="Nama"
                    required
                    value={contact.nama}
                    onChange={(v) => setContact("nama", v)}
                    error={nameErr}
                    inputRef={nameRef}
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <TextField
                    id="pemesan-email"
                    label="Email"
                    required
                    value={contact.email}
                    onChange={(v) => setContact("email", v)}
                    error={emailErr}
                    helper="E-ticket akan dikirim ke email ini."
                    inputRef={emailRef}
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <PhoneInput
                    id="pemesan-wa"
                    label="WhatsApp"
                    value={contact.whatsapp}
                    onChange={(v) => setContact("whatsapp", v)}
                    error={waErr}
                    inputRef={waRef}
                  />
                </div>
              </div>
            </form>
          </section>

          {/* Seat Map + Penumpang */}
          <section
            aria-labelledby="seatmap"
            className="border rounded p-4 space-y-4"
          >
            <h2 id="seatmap" className="text-xl font-semibold">
              Pilih Kursi
            </h2>
            <div
              ref={seatGridRef}
              tabIndex={-1}
              className="grid grid-cols-4 gap-3 max-w-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              {seats.map((s) => (
                <SeatButton
                  key={s.id}
                  id={s.id}
                  taken={s.taken}
                  selected={selectedSeats.includes(s.id)}
                  onToggle={() => toggleSeat(s.id)}
                />
              ))}
            </div>

            {!!selectedSeats.length && (
              <div className="space-y-2">
                <div className="font-medium text-sm">Data Penumpang</div>
                <div className="grid grid-cols-12 gap-4">
                  {passengers.map((p) => {
                    const nameErr = p.nama.trim() ? "" : "Wajib diisi.";
                    const phoneErr = waValid(p.phone) ? "" : "WA tidak valid.";
                    return (
                      <div
                        key={p.seat}
                        className="col-span-12 md:col-span-6 space-y-2 border p-2 rounded-md"
                      >
                        <div>
                          <label className="block text-xs mb-1">
                            Nama (Kursi {p.seat})
                          </label>
                          <input
                            ref={(el) => {
                              paxNameRefs.current[p.seat] = el;
                            }}
                            className={`w-full border rounded px-3 py-2 ${
                              nameErr ? "border-red-500" : ""
                            }`}
                            value={p.nama}
                            onChange={(e) =>
                              setPassengerName(p.seat, e.target.value)
                            }
                            aria-invalid={!!nameErr}
                          />
                          {!!nameErr && (
                            <p className="text-xs text-red-600">{nameErr}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs mb-1">
                            WhatsApp (Kursi {p.seat})
                          </label>
                          <PassengerPhoneInput
                            seatId={p.seat}
                            value={p.phone}
                            onChange={(v) => setPassengerPhone(p.seat, v)}
                            error={phoneErr}
                            inputRef={(el) => {
                              paxPhoneRefs.current[p.seat] = el;
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* Kupon & S&K */}
          <section
            aria-labelledby="kupon"
            className="border rounded p-4 space-y-4"
          >
            <h2 id="kupon" className="text-xl font-semibold">
              Kupon & S&K
            </h2>
            <CouponField
              value={couponInput}
              onChange={setCouponInput}
              onApply={onApplyCoupon}
              onRemove={onRemoveCoupon}
              error={coupon.error}
              active={!coupon.error ? coupon.code : undefined}
            />
            <div className="flex items-center gap-2">
              <TermsPreview checked={termsAccepted} onChange={setTerms} />
              {/* hidden input for focus target */}
              <input ref={termsRef} className="sr-only" aria-hidden />
            </div>
          </section>

          {!!errors.length && (
            <section
              aria-live="polite"
              className="border border-red-300 bg-red-50 text-red-700 rounded p-3 space-y-1"
            >
              {errors.map((e, i) => (
                <div key={i}>• {e}</div>
              ))}
            </section>
          )}
        </section>

        {/* RIGHT summary */}

        <aside className="col-span-12 hidden lg:block lg:col-span-4">
          <Ringkasan
            aria="summary"
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            className="lg:sticky lg:top-6 border rounded p-4 space-y-3"
          />
        </aside>
      </div>
      {toast && <Toast message={toast.msg} type={toast.type} />}
    </Container>
  );
}
