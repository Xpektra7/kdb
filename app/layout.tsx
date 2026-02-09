import type { Metadata } from "next";
import { Figtree, Inter } from "next/font/google";
import { Provider } from "@/components/providers/session-provider";
import Navbar from "@/components/navbar";
import "./globals.css";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({subsets: ['latin'], variable: '--font-inter'});

export const metadata: Metadata = {
  title: "Apollo",
  description: "Your AI-Powered Knowledge Database for Engineering Projects",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${figtree.variable} ${inter.variable} antialiased bg-background dark text-muted-foreground `}
      >
        <Provider>
          <Navbar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
