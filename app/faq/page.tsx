'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import React, { use, useState } from 'react';

interface FAQItem {
  question: string;
  answer: string | string[];
}

const faqData: FAQItem[] = [
  {
    question: "What exactly is Apollo?",
    answer: "Apollo is a structured engineering project planning system for engineering students. It helps turn a project idea into a clear, technically coherent, buildable plan by forcing correct engineering decisions before any coding or wiring begins."
  },
  {
    question: "Is Apollo a chatbot?",
    answer: [
      "No. Apollo is not a chatbot and does not behave like ChatGPT.",
      "All outputs are:",
      "• Strictly structured",
      "• Schema-validated JSON",
      "• Decision-driven, not conversational",
      "• Focused on engineering systems, not inspiration",
      "If Apollo starts giving vague advice or chatting, that's considered a failure."
    ]
  },
  {
    question: "What problem is Apollo solving?",
    answer: [
      "Apollo addresses a common student failure mode:",
      "• Random part selection",
      "• Late discovery of incompatibilities",
      "• Budget overruns",
      "• Half-working demos",
      "• Weak system-level understanding",
      "Apollo slows users down at the right time to prevent bad early decisions."
    ]
  },
  {
    question: "How is Apollo different from tutorials or YouTube guides?",
    answer: [
      "Tutorials usually:",
      "• Start with components or code",
      "• Assume decisions are already correct",
      "• Hide tradeoffs",
      "",
      "Apollo:",
      "• Starts with system decisions",
      "• Explicitly shows tradeoffs",
      "• Forces compatibility, cost, and availability checks",
      "• Treats the project as an engineering system, not a demo"
    ]
  },
  {
    question: "Does Apollo generate project ideas?",
    answer: [
      "No. Apollo assumes you already have a project idea.",
      "Its job is to:",
      "• Break the idea into subsystems",
      "• Evaluate realistic options",
      "• Help you choose correctly",
      "• Show what the final system will look like"
    ]
  },
  {
    question: "What are the three layers Apollo follows?",
    answer: [
      "Apollo always works in this order:",
      "1. Decision Matrix — Identifies subsystems, options, and tradeoffs. Nothing is built here.",
      "2. Blueprint — Freezes decisions and produces a full system architecture, cost estimate, risks, and skill requirements.",
      "3. Build Guide (planned) — Wiring, code structure, testing, and validation — only after the design is finalized.",
      "Skipping layers is not allowed."
    ]
  },
  {
    question: "Why is the Decision Matrix so important?",
    answer: [
      "Because most project failures happen here.",
      "The Decision Matrix:",
      "• Prevents incompatible components",
      "• Exposes hidden constraints early",
      "• Forces engineering reasoning",
      "• Makes tradeoffs explicit",
      "If this step is wrong, everything downstream fails."
    ]
  },
  {
    question: "What types of projects does Apollo support?",
    answer: [
      "Currently:",
      "• Embedded systems",
      "• IoT projects",
      "• Hardware–software systems",
      "• Engineering-focused builds",
      "",
      "Not supported (for now):",
      "• Pure software projects",
      "• UI/UX or design-only projects",
      "• Theory-only academic exercises"
    ]
  },
  {
    question: "Why are AI responses cached?",
    answer: [
      "AI calls are:",
      "• Expensive",
      "• Rate-limited",
      "• Often repeated for the same project titles",
      "",
      "Caching:",
      "• Reduces cost",
      "• Improves response speed",
      "• Prevents rate-limit crashes",
      "• Ensures consistent outputs",
      "Apollo uses PostgreSQL (via Supabase) as an AI response cache."
    ]
  },
  {
    question: "Why does Apollo return JSON instead of text?",
    answer: [
      "Because engineering systems require structure, not prose.",
      "JSON allows:",
      "• Schema validation",
      "• Deterministic UI rendering",
      "• Safer downstream processing",
      "• Less hallucination",
      "• Clear separation of concerns",
      "Text explanations are derived from JSON, not the other way around."
    ]
  },
  {
    question: "Is Apollo meant to replace learning or thinking?",
    answer: [
      "No. Apollo forces thinking.",
      "It does not:",
      "• Choose for you",
      "• Hide complexity",
      "• Automate engineering judgment",
      "It makes decisions visible and unavoidable."
    ]
  },
  {
    question: "Can I use Apollo for real-world projects?",
    answer: [
      "Yes — especially for:",
      "• Capstone projects",
      "• Hackathons",
      "• SIWES / industrial training prep",
      "• Personal engineering builds",
      "Apollo is designed to feel engineering-realistic, not academic or toy-like."
    ]
  }
];

const FAQSection: React.FC = () => {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-white bg-black transition-colors duration-200 mb-8 group"
          >
            <svg
              className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Back</span>
          </button>

          {/* Title Section */}
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              FAQs
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Everything you need to know about Apollo &#8595;
            </p>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
            <Accordion type="multiple" className="w-full border-b border-border mb-2">
            {faqData.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="py-2 sm:py-2.5 bg-transparent text-xs sm:text-lg font-medium hover:text-foreground transition-colors">{faq.question}</AccordionTrigger>
                        <AccordionContent className="sm:text-lg">
                        {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
             ))}
             </Accordion>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
