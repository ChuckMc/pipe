#!/usr/bin/env node

import { analyzeWithAI } from "./ai/client.js";
import { parseArgs, printHelp } from "./cli/flags.js";
import { startWatching } from "./stream/watcher.js";
import { stdin as input, stdout } from "node:process";

/**
 * Read all of stdin into a string.
 */
function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    input.setEncoding("utf-8");

    input.on("data", (chunk: string) => chunks.push(Buffer.from(chunk)));
    input.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    input.on("error", reject);
  });
}

/**
 * Detect if stdin has piped data (vs interactive TTY).
 * Uses the TTY flag on stdin: when piped, it's not a TTY.
 */
function isPiped(): boolean {
  return !input.isTTY;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  if (!options.query) {
    console.error("Error: No question provided.\n");
    printHelp();
    process.exit(1);
  }

  const piped = isPiped();

  if (options.watch) {
    // ---- WATCH MODE ----
    console.error("pipe: watching stdin... (Ctrl+C to stop)\n");

    await startWatching(input, {
      onData: async (chunk) => {
        console.error(`pipe: analyzing ${chunk.length} chars...`);
        const response = await analyzeWithAI(chunk, options.query, {
          model: options.model,
          maxTokens: options.maxTokens,
        });
        console.log(response);
        console.log("\n---\n");
      },
      onError: (err) => {
        console.error("pipe: stdin error:", err.message);
      },
    });
  } else if (piped) {
    // ---- PIPED MODE ----
    const stdinContent = await readStdin();
    const response = await analyzeWithAI(stdinContent, options.query, {
      model: options.model,
      maxTokens: options.maxTokens,
    });
    console.log(response);
  } else {
    // ---- INTERACTIVE MODE ----
    console.error("pipe: Paste your content, then press Ctrl+D when done.\n");
    const stdinContent = await readStdin();
    const response = await analyzeWithAI(stdinContent, options.query, {
      model: options.model,
      maxTokens: options.maxTokens,
    });
    console.log(response);
  }
}

main().catch((err) => {
  console.error("pipe: Unexpected error:", err.message);
  process.exit(1);
});
