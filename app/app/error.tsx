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
      title="Application Error"
      message="We're sorry, but something went wrong while loading this page. Our team has been notified."
    />
  );
}
