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
      title="Decision Matrix Error"
      message="Unable to load the decision matrix. This might be due to a network issue or the project data may be unavailable."
    />
  );
}
