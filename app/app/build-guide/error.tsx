"use client";

import ErrorComponent from "@/components/error/error-boundary";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorComponent
      error={error}
      reset={reset}
      title="Build Guide Error"
      message="Unable to load the build guide. Please ensure you have completed the blueprint stage first."
    />
  );
}
