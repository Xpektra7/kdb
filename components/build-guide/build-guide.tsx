import { BuildOverview } from "@/components/build-guide/build-overview";
import { Prerequisites } from "@/components/build-guide/prerequisites";
import { Wiring } from "@/components/build-guide/wiring";
import { Firmware } from "@/components/build-guide/firmware";
import { Calibration } from "@/components/build-guide/calibration";
import { Testing } from "@/components/build-guide/testing";
import { CommonFailures } from "@/components/build-guide/common-failures";
import { Safety } from "@/components/build-guide/safety";
import { NextSteps } from "@/components/build-guide/next-steps";
import type { BuildGuideProps } from "@/lib/definitions";

export default function BuildGuideView({
  buildGuideData,
  contentRefSetter,
}: BuildGuideProps) {
  return (
    <>
      <div className="bg-muted/30 p-4 rounded-lg border-l-2 border-border">
        <p className="text-sm leading-relaxed">
          Step-by-step build guide with wiring, firmware, calibration, and
          testing procedures.
        </p>
      </div>

      {/* Project Header */}
      <div className="bg-background rounded-lg shadow-sm border border-border p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-2 wrap-break-words">
          {buildGuideData.project}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">Build Guide</p>
      </div>

      {/* Build Overview */}
      {buildGuideData.build_overview && (
        <BuildOverview
          overview={buildGuideData.build_overview}
          contentRef={contentRefSetter("overview")}
        />
      )}

      {/* Prerequisites */}
      {buildGuideData.prerequisites && (
        <Prerequisites
          prerequisites={buildGuideData.prerequisites}
          contentRef={contentRefSetter("prerequisites")}
        />
      )}

      {/* Wiring */}
      {buildGuideData.wiring && (
        <Wiring
          wiring={buildGuideData.wiring}
          contentRef={contentRefSetter("wiring")}
        />
      )}

      {/* Firmware */}
      {buildGuideData.firmware && (
        <Firmware
          firmware={buildGuideData.firmware}
          contentRef={contentRefSetter("firmware")}
        />
      )}

      {/* Calibration */}
      {buildGuideData.calibration && buildGuideData.calibration.length > 0 && (
        <Calibration
          calibration={buildGuideData.calibration}
          contentRef={contentRefSetter("calibration")}
        />
      )}

      {/* Testing */}
      {buildGuideData.testing && (
        <Testing
          testing={buildGuideData.testing}
          contentRef={contentRefSetter("testing")}
        />
      )}

      {/* Common Failures */}
      {buildGuideData.common_failures &&
        buildGuideData.common_failures.length > 0 && (
          <CommonFailures
            failures={buildGuideData.common_failures}
            contentRef={contentRefSetter("failures")}
          />
        )}

      {/* Safety */}
      {buildGuideData.safety && buildGuideData.safety.length > 0 && (
        <Safety
          safety={buildGuideData.safety}
          contentRef={contentRefSetter("safety")}
        />
      )}

      {/* Next Steps */}
      {buildGuideData.next_steps && buildGuideData.next_steps.length > 0 && (
        <NextSteps
          nextSteps={buildGuideData.next_steps}
          contentRef={contentRefSetter("next-steps")}
        />
      )}
    </>
  );
}
