// Use pdfkit on a server route since you already have the architecture:

// Extract content → JSON schema
// Send to /api/generate/pdf endpoint
// Generate PDF server-side with full styling control
// Stream back to user

// Check your current data structure (the detectPageType, cleanContent functions)
// Create a JSON schema for your pages
// Build a /api/generate/pdf route
// Modify the export button to use it