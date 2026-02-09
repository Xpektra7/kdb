"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon, RefreshIcon, Home01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ErrorComponentProps {
  error?: Error;
  reset?: () => void;
  title?: string;
  message?: string;
  showReset?: boolean;
  showHome?: boolean;
  showBack?: boolean;
}

export default function ErrorComponent({
  error,
  reset,
  title = "Something went wrong",
  message = "We encountered an unexpected error. Please try again or return to the home page.",
  showReset = true,
  showHome = true,
  showBack = true,
}: ErrorComponentProps) {
  // Ensure reset is always defined
  const resetFn = reset || (() => window.location.reload());
  const router = useRouter();

  const handleReset = () => {
    resetFn();
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Error Icon - Neutral gray instead of red */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <HugeiconsIcon icon={InformationCircleIcon} className="w-10 h-10 text-muted-foreground" />
          </div>
        </div>

        {/* Error Content */}
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          <p className="text-muted-foreground leading-relaxed">{message}</p>
          
          {/* Error details - only show for major errors */}
          {error?.message && (
            <div className="mt-4 p-3 bg-muted/50 border border-border rounded-lg text-left">
              <p className="text-xs text-muted-foreground font-mono break-all">
                {error.message}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          {showReset && (
            <Button 
              onClick={handleReset}
              variant="default"
              className="gap-2"
            >
              <HugeiconsIcon icon={RefreshIcon} className="w-4 h-4" />
              Try Again
            </Button>
          )}
          
          {showBack && (
            <Button 
              onClick={() => router.back()}
              variant="outline"
              className="gap-2"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4" />
              Go Back
            </Button>
          )}
          
          {showHome && (
            <Button 
              onClick={() => router.push("/")}
              variant="outline"
              className="gap-2"
            >
              <HugeiconsIcon icon={Home01Icon} className="w-4 h-4" />
              Home
            </Button>
          )}
        </div>

        {/* Support Info */}
        <div className="pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            If this problem persists, please try refreshing the page or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
