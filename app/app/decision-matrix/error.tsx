"use client"

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-4">
        Something went wrong!
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground">
        An unexpected error has occurred. Please try again later.
      </p>
    </div>
  );
}
