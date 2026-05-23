import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";

function loadEnvFile(filePath) {
  try {
    const content = readFileSync(filePath, "utf8");

    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmed.indexOf("=");

      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const rawValue = trimmed.slice(separatorIndex + 1).trim();
      const value = rawValue.replace(/^["']|["']$/g, "");

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env.local is optional so CI can provide real environment variables.
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"));

const requiredKeys = [
  "NEXT_PUBLIC_CONVEX_URL",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "ADMIN_SETUP_TOKEN",
];

const missingKeys = requiredKeys.filter((key) => !process.env[key]);

if (missingKeys.length > 0) {
  throw new Error(`Missing required environment values: ${missingKeys.join(", ")}`);
}

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
const seedAdmin = makeFunctionReference("admin:seedAdmin");

const result = await client.action(seedAdmin, {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  setupToken: process.env.ADMIN_SETUP_TOKEN,
});

console.log(`Seeded admin account for ${result.email}.`);
