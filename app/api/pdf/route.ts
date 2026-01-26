// Use pdfkit on a server route since you already have the architecture:

// Extract content → JSON schema
// Send to /api/generate/pdf endpoint
// Generate PDF server-side with full styling control
// Stream back to user

// Check your current data structure (the detectPageType, cleanContent functions)
// Create a JSON schema for your pages
// Build a /api/generate/pdf route
// Modify the export button to use it

// app/api/pdf/route.ts
// app/api/pdf/route.ts
// app/api/pdf/route.ts
import { NextResponse } from "next/server";
import { generatePDFBuffer } from "@/lib/pdfGenerator";

export async function POST(req: Request) {
  try {
    const { data } = await req.json();
    console.log("PDF generation request received");

    const pdfBytes = await generatePDFBuffer(data);

    console.log("PDF generated successfully, size:", pdfBytes.length);

    // ✅ Convert Uint8Array to Buffer
    const buffer = Buffer.from(pdfBytes);

    return new Response(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${data.title || 'report'}.pdf"`,
      },
    });
  } catch (err) {
    console.error("API route error:", err);
    return new NextResponse(
      JSON.stringify({ error: "Failed to generate PDF", details: String(err) }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}