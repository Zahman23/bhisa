export type Query = {
  asal: string;
  tujuan: string;
  tanggal: string; // yyyy-mm-dd
  kursi: number;
};

export type Shuttle = {
  id: string;
  operator: string;
  origin: string;
  destination: string;
  tanggal: string; // yyyy-mm-dd
  departures: Departure[];
};

export type Departure = {
  id: string;
  berangkat: string; // "HH:mm"
  tiba: string; // "HH:mm"
  durasiMenit: number;
  sisaKursi: number;
  harga: number;
  pickup: string;
  dropoff: string;
};

export type FlatDeparture = Departure & {
  shuttleId: string;
  operator: string;
  origin: string;
  destination: string;
  tanggal: string;
};
