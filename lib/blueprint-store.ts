/**
 * File-based store for blueprint requests.
 * 
 * Stores data in .tmp/blueprints/ directory for persistence across hot reloads.
 * This will be replaced by the backend dev with a real DB (Postgres/MongoDB).
 * The API contract (POST/GET routes) will remain the same.
 */

import * as fs from "fs";
import * as path from "path";

interface BlueprintRequest {
  project: string;
  selectedOptions: Record<string, unknown>;
  createdAt: number;
}

const STORE_DIR = path.join(process.cwd(), ".tmp", "blueprints");
const TTL = 60 * 60 * 1000; // 1 hour

// Ensure store directory exists
function ensureStoreDir() {
  if (!fs.existsSync(STORE_DIR)) {
    fs.mkdirSync(STORE_DIR, { recursive: true });
  }
}

// Generate short ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function saveBlueprint(data: { project: string; selectedOptions: Record<string, unknown> }): string {
  ensureStoreDir();
  
  const requestId = generateId();
  const filePath = path.join(STORE_DIR, `${requestId}.json`);
  
  const fileData: BlueprintRequest = {
    ...data,
    createdAt: Date.now(),
  };
  
  fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));
  console.log(`[Blueprint Store] Saved to ${filePath}`);
  
  // Schedule cleanup after TTL
  setTimeout(() => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`[Blueprint Store] Cleaned up expired ${requestId}`);
      }
    } catch (err) {
      console.error(`[Blueprint Store] Failed to cleanup ${requestId}:`, err);
    }
  }, TTL);
  
  return requestId;
}

export function getBlueprint(requestId: string): BlueprintRequest | undefined {
  ensureStoreDir();
  
  const filePath = path.join(STORE_DIR, `${requestId}.json`);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`[Blueprint Store] File not found: ${requestId}`);
      return undefined;
    }
    
    const data = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(data) as BlueprintRequest;
    console.log(`[Blueprint Store] Retrieved ${requestId}`);
    
    return parsed;
  } catch (err) {
    console.error(`[Blueprint Store] Error reading ${requestId}:`, err);
    return undefined;
  }
}

// Dev utility: check store size
export function getStoreSize(): number {
  ensureStoreDir();
  try {
    return fs.readdirSync(STORE_DIR).length;
  } catch {
    return 0;
  }
}