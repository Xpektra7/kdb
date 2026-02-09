import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  RocketIcon, 
  GitCommitIcon, 
  File01Icon, 
  ToolsIcon, 
  Idea01Icon, 
  Shield01Icon, 
  ZapIcon,
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  BookOpen01Icon,
  Alert02Icon,
  Menu01Icon
} from "@hugeicons/core-free-icons";

export default function GettingStartedPage() {
  return (
    <main className="max-w-5xl mx-auto py-16 px-6">
      {/* Hero Section */}
      <header className="mb-16 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
            <HugeiconsIcon icon={RocketIcon} className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Getting Started with <span className="text-primary">Apollo</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Transform your engineering project ideas into detailed, actionable build plans 
          through structured decision-making and AI-powered guidance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/app"
            className={buttonVariants({ size: "lg", className: "gap-2" })}
          >
            Start Your Project
            <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
          </Link>
          <Link
            href="/examples"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            View Examples
          </Link>
        </div>
      </header>

      {/* What is Apollo */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Badge variant="secondary" className="mb-4">The Problem</Badge>
            <h2 className="text-3xl font-bold mb-4">Why Most Student Projects Fail</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Engineering students often jump straight into buying components without proper planning. 
              They discover too late that sensors are incompatible, power budgets are exceeded, or 
              parts are unavailable in their region.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The result? Half-working demos, wasted money, and missed learning opportunities.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-destructive/20 bg-card p-6">
              <div className="text-3xl font-bold text-destructive mb-1">73%</div>
              <p className="text-sm text-muted-foreground">Of projects have incompatible components</p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="text-3xl font-bold text-primary mb-1">3x</div>
              <p className="text-sm text-muted-foreground">Cost overrun on average</p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="text-3xl font-bold text-primary mb-1">60%</div>
              <p className="text-sm text-muted-foreground">Incomplete demos at deadline</p>
            </div>
            <div className="rounded-lg border border-primary/20 bg-card p-6">
              <div className="text-3xl font-bold text-primary mb-1">0</div>
              <p className="text-sm text-muted-foreground">Planning tools used</p>
            </div>
          </div>
        </div>
      </section>

      {/* How Apollo Helps */}
      <section className="mb-16">
        <Badge variant="secondary" className="mb-4">The Solution</Badge>
        <h2 className="text-3xl font-bold mb-6">How Apollo Fixes This</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border border-l-4 border-l-primary bg-card p-6">
            <HugeiconsIcon icon={Idea01Icon} className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Structured Decisions</h3>
            <p className="text-sm text-muted-foreground">
              Forces you to think through subsystems and tradeoffs before buying anything
            </p>
          </div>
          <div className="rounded-lg border border-l-4 border-l-blue-500 bg-card p-6">
            <HugeiconsIcon icon={GitCommitIcon} className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="font-semibold mb-2">Clear Architecture</h3>
            <p className="text-sm text-muted-foreground">
              Shows exactly how components connect and interact in your system
            </p>
          </div>
          <div className="rounded-lg border border-l-4 border-l-green-500 bg-card p-6">
            <HugeiconsIcon icon={Shield01Icon} className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="font-semibold mb-2">Risk Mitigation</h3>
            <p className="text-sm text-muted-foreground">
              Identifies potential failures before you encounter them in hardware
            </p>
          </div>
          <div className="rounded-lg border border-l-4 border-l-purple-500 bg-card p-6">
            <HugeiconsIcon icon={ZapIcon} className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="font-semibold mb-2">Faster Learning</h3>
            <p className="text-sm text-muted-foreground">
              Understand why each component choice matters for your specific project
            </p>
          </div>
        </div>
      </section>

      {/* The Three-Stage Workflow */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="secondary">Process</Badge>
        </div>
        <h2 className="text-3xl font-bold mb-4">The Three-Stage Workflow</h2>
        <p className="text-muted-foreground mb-8 max-w-3xl">
          Apollo guides you through a rigorous engineering process. Each stage builds on the previous one—you 
          cannot skip ahead. This ensures your final design is coherent, buildable, and properly planned.
        </p>

        <div className="grid gap-6">
          {/* Stage 1 */}
          <div className="rounded-lg border relative overflow-hidden bg-card">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Decision Matrix</h3>
                  <p className="text-sm text-muted-foreground italic">
                    &quot;What systems does this project need?&quot;
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="flex items-start gap-2">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Breaks project into logical <strong>subsystems</strong> (sensing, control, power, etc.)
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Lists <strong>realistic component options</strong> for each subsystem
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Surfaces <strong>tradeoffs</strong>—cost, complexity, availability, power draw
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Identifies <strong>known engineering problems</strong> and mitigations
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Goal:</span> Prevent bad early decisions
                </p>
                <Link
                  href="/examples/decision-matrix"
                  className={buttonVariants({ variant: "link", className: "px-0" })}
                >
                  View Example →
                </Link>
              </div>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="rounded-lg border relative overflow-hidden bg-card">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <span className="text-blue-500 font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Blueprint</h3>
                  <p className="text-sm text-muted-foreground italic">
                    &quot;Given these choices, what does the system look like?&quot;
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="flex items-start gap-2">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Freezes chosen options from Stage 1
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Generates unified <strong>system architecture</strong> with block diagrams
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Estimates <strong>total cost</strong> and <strong>required skills</strong>
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Documents <strong>risks, constraints, and failure modes</strong>
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Goal:</span> Complete design before ordering parts
                </p>
                <Link
                  href="/examples/blueprint"
                  className={buttonVariants({ variant: "link", className: "px-0" })}
                >
                  View Example →
                </Link>
              </div>
            </div>
          </div>

          {/* Stage 3 */}
          <div className="rounded-lg border relative overflow-hidden bg-card">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <span className="text-green-500 font-bold">3</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold">Build Guide</h3>
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                      Ready
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    &quot;How do I actually build this?&quot;
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="flex items-start gap-2">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Detailed <strong>wiring diagrams</strong> and pin mappings
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Code structure and library recommendations
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <strong>Calibration</strong> and testing procedures
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Common failure points and <strong>debugging tips</strong>
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Goal:</span> Successful implementation
                </p>
                <Link
                  href="/examples/build-guide"
                  className={buttonVariants({ variant: "link", className: "px-0" })}
                >
                  View Example →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-16">
        <Badge variant="secondary" className="mb-4">Tips</Badge>
        <h2 className="text-3xl font-bold mb-6">Best Practices for Success</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <HugeiconsIcon icon={File01Icon} className="w-5 h-5 text-primary" />
              Be Specific
            </h3>
            <p className="text-sm text-muted-foreground">
              &quot;Smart plant monitor with soil moisture and Wi-Fi alerts&quot; yields far better 
              results than vague titles like &quot;plant project.&quot; Include key features and constraints.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <HugeiconsIcon icon={Shield01Icon} className="w-5 h-5 text-primary" />
              State Constraints Early
            </h3>
            <p className="text-sm text-muted-foreground">
              Budget limits, local part availability, and your skill level should inform every 
              subsystem choice. Surface these constraints at the Decision Matrix stage.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <HugeiconsIcon icon={GitCommitIcon} className="w-5 h-5 text-primary" />
              Don&apos;t Skip Stages
            </h3>
            <p className="text-sm text-muted-foreground">
              Jumping straight to wiring or code is the #1 cause of broken demos. Let the 
              Decision Matrix catch incompatibilities before you buy components.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <HugeiconsIcon icon={Idea01Icon} className="w-5 h-5 text-primary" />
              Review Tradeoffs Honestly
            </h3>
            <p className="text-sm text-muted-foreground">
              Cheaper parts may lack features; powerful parts may exceed your power budget. 
              Use the tradeoff tables to make informed, context-appropriate choices.
            </p>
          </div>
        </div>
      </section>

      {/* What Apollo Is Not */}
      <section className="mb-16">
        <Badge variant="secondary" className="mb-4">Clarifications</Badge>
        <h2 className="text-3xl font-bold mb-6">What Apollo Is <em>Not</em></h2>
        <div className="rounded-lg border bg-muted/30 p-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <span className="text-destructive font-bold text-sm">✕</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Not a Chatbot</h3>
                <p className="text-sm text-muted-foreground">
                  Apollo outputs structured data, not conversational prose. Every response is 
                  designed for engineering decision-making.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <span className="text-destructive font-bold text-sm">✕</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Not an Idea Generator</h3>
                <p className="text-sm text-muted-foreground">
                  You bring the project idea. Apollo helps you engineer it properly, not 
                  brainstorm new concepts.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <span className="text-destructive font-bold text-sm">✕</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Not Copy-Paste Code</h3>
                <p className="text-sm text-muted-foreground">
                  Build Guides explain code structure and logic—they don&apos;t dump boilerplate 
                  you don&apos;t understand.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <span className="text-destructive font-bold text-sm">✕</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Not a Video Tutorial</h3>
                <p className="text-sm text-muted-foreground">
                  Theory appears only when it explains a real system decision, not as 
                  generic background content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="mb-16">
        <Badge variant="secondary" className="mb-4">Quick Start</Badge>
        <h2 className="text-3xl font-bold mb-6">Start Building in 5 Minutes</h2>
        <div className="rounded-lg border border-primary/20 bg-card">
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-primary-foreground font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Navigate to the App</h3>
                  <p className="text-sm text-muted-foreground">
                    Go to <Link href="/app" className="text-primary underline underline-offset-2">/app</Link> and 
                    sign in or create an account.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-primary-foreground font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Enter Your Project Title</h3>
                  <p className="text-sm text-muted-foreground">
                    Be specific: &quot;Solar-powered flood sensor with LoRaWAN and SMS alerts&quot;
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-primary-foreground font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Review the Decision Matrix</h3>
                  <p className="text-sm text-muted-foreground">
                    Apollo generates subsystems, options, and tradeoffs. Select your preferred option for each subsystem.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-primary-foreground font-bold text-sm">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Generate Blueprint & Build Guide</h3>
                  <p className="text-sm text-muted-foreground">
                    Proceed through the stages to get your complete project documentation.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-primary-foreground font-bold text-sm">
                  5
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Export and Build</h3>
                  <p className="text-sm text-muted-foreground">
                    Download your project as a PDF or export individual sections. Start building with confidence!
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/app"
                className={buttonVariants({ size: "lg", className: "gap-2" })}
              >
                <HugeiconsIcon icon={ToolsIcon} className="w-4 h-4" />
                Start Building Now
              </Link>
              <Link
                href="/examples"
                className={buttonVariants({ variant: "outline", size: "lg", className: "gap-2" })}
              >
                <HugeiconsIcon icon={BookOpen01Icon} className="w-4 h-4" />
                Browse Examples
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="mb-16">
        <Badge variant="secondary" className="mb-4">Questions?</Badge>
        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-2">Is Apollo free to use?</h3>
            <p className="text-sm text-muted-foreground">
              Yes! Apollo is completely free for students and hobbyists. We believe engineering 
              education should be accessible to everyone.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-2">What types of projects work best?</h3>
            <p className="text-sm text-muted-foreground">
              Apollo excels at embedded systems, IoT devices, robotics, and hardware projects with 
              multiple subsystems. Pure software projects without hardware components are less suited.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-2">Can I export my project?</h3>
            <p className="text-sm text-muted-foreground">
              Absolutely! You can export your Decision Matrix, Blueprint, and Build Guide as a 
              professional PDF document—perfect for documentation, presentations, or submission.
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/faq"
            className={buttonVariants({ variant: "link" })}
          >
            View all FAQs →
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Build Something Amazing?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Join thousands of engineering students who are planning smarter, building better, 
          and learning more with Apollo.
        </p>
        <Link
          href="/app"
          className={buttonVariants({ size: "lg", className: "gap-2" })}
        >
          <HugeiconsIcon icon={RocketIcon} className="w-4 h-4" />
          Start Your First Project
        </Link>
      </section>
    </main>
  );
}
