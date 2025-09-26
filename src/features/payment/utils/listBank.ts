export const BANKS = ["BCA", "BRI", "Mandiri", "BNI"] as const;
export const BANK_ACCOUNTS: Record<
  (typeof BANKS)[number],
  { transfer: string; va: string; name: string }
> = {
  BCA: {
    transfer: "1234567890",
    va: "3901 1234 5678 90",
    name: "PT Bhisa Shuttle",
  },
  BRI: {
    transfer: "0987654321",
    va: "2627 1234 5678 90",
    name: "PT Bhisa Shuttle",
  },
  Mandiri: {
    transfer: "112233445566",
    va: "89508 1234 5678 90",
    name: "PT Bhisa Shuttle",
  },
  BNI: {
    transfer: "4455667788",
    va: "988 1234 5678 90",
    name: "PT Bhisa Shuttle",
  },
};
export const QR_PAYLOAD = "00020101021126680012ID.QRIS...";
