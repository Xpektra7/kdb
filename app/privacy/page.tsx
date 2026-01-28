'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import React from 'react';

interface PrivacyItem {
  title: string;
  content: string | string[];
}

const privacyData: PrivacyItem[] = [
  {
    title: "Information We Collect",
    content: [
      "When you use Apollo, we collect:",
      "• Project titles and descriptions you provide",
      "• System decisions and technical choices you make",
      "• Usage data and interaction patterns",
      "• Account information (email, name) if you create an account",
      "We do not collect sensitive personal information beyond what's necessary for the service."
    ]
  },
  {
    title: "How We Use Your Information",
    content: [
      "Your information is used to:",
      "• Provide and improve Apollo's planning features",
      "• Cache AI responses to improve performance and reduce costs",
      "• Analyze usage patterns to enhance the user experience",
      "• Send important updates about the service",
      "We never sell your data to third parties."
    ]
  },
  {
    title: "AI Response Caching",
    content: [
      "Apollo caches AI-generated responses using PostgreSQL (via Supabase) to:",
      "• Reduce API costs",
      "• Improve response times",
      "• Ensure consistent outputs",
      "Cached responses are associated with project parameters, not personal identities. This data helps us serve all users more efficiently."
    ]
  },
  {
    title: "Data Storage and Security",
    content: [
      "Your data is stored securely using:",
      "• Industry-standard encryption (in transit and at rest)",
      "• Supabase's secure PostgreSQL infrastructure",
      "• Regular security audits and updates",
      "We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, or destruction."
    ]
  },
  {
    title: "Data Retention",
    content: [
      "We retain your data as follows:",
      "• Active project data: Until you delete it or close your account",
      "• Cached AI responses: Until cache expires or is manually cleared",
      "• Account information: Until you request account deletion",
      "You can request deletion of your data at any time by contacting us."
    ]
  },
  {
    title: "Your Rights",
    content: [
      "You have the right to:",
      "• Access your personal data",
      "• Correct inaccurate data",
      "• Request deletion of your data",
      "• Export your project data",
      "• Opt out of non-essential communications",
      "To exercise these rights, contact us at privacy@apollo.example.com"
    ]
  },
  {
    title: "Third-Party Services",
    content: [
      "Apollo uses the following third-party services:",
      "• OpenAI/Anthropic: For AI-powered decision matrices and planning",
      "• Supabase: For database and authentication",
      "• Analytics tools: For usage statistics (anonymized)",
      "These services have their own privacy policies. We only share data necessary for these services to function."
    ]
  },
  {
    title: "Cookies and Tracking",
    content: [
      "We use cookies to:",
      "• Maintain your session",
      "• Remember your preferences",
      "• Analyze site usage (anonymized)",
      "You can control cookie settings through your browser. Note that disabling cookies may limit some functionality."
    ]
  },
  {
    title: "Children's Privacy",
    content: "Apollo is intended for use by engineering students, typically 18 years or older. We do not knowingly collect personal information from children under 13. If you believe we have collected data from a child, please contact us immediately."
  },
  {
    title: "International Data Transfers",
    content: [
      "Your data may be transferred to and stored in countries outside your residence, including the United States.",
      "We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy and applicable laws."
    ]
  },
  {
    title: "Changes to This Policy",
    content: [
      "We may update this privacy policy from time to time. Changes will be:",
      "• Posted on this page",
      "• Notified via email for significant changes",
      "• Effective immediately upon posting",
      "Your continued use of Apollo after changes constitutes acceptance of the updated policy."
    ]
  },
];

const PrivacySection: React.FC = () => {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-white bg-black mb-8 group"
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
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Last updated: January 27, 2026
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg border border-accent-border">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Apollo is committed to protecting your privacy. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you use our engineering project planning system. 
            Please read this policy carefully. By using Apollo, you agree to the collection and use of information 
            in accordance with this policy.
          </p>
        </div>

        {/* Privacy Items */}
        <div className="space-y-4">
          <Accordion type="multiple" className="w-full border-b border-border mb-2">
            {privacyData.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="py-2 sm:py-2.5 bg-transparent text-xs sm:text-lg font-medium hover:text-foreground transition-colors">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="sm:text-lg">
                  {typeof item.content === 'string' ? (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item.content}</p>
                  ) : (
                    <div className="space-y-2">
                      {item.content.map((line, idx) => (
                        <p key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export default PrivacySection;