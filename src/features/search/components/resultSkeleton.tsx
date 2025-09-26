// src/features/search/components/ResultsSkeleton.tsx

import Skeleton from "../../../components/global/Skeleton";

export default function ResultsSkeleton() {
  // contoh 5 kartu skeleton
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </>
  );
}
