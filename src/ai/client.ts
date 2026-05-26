import Anthropic from "@anthropic-ai/sdk";
import { Writable } from "node:stream";

const ANTHROPIC_API_KEY_ENV = "ANTHROPIC_API_KEY";

export interface AIOptions {
  model?: string;
  maxTokens?: number;
  signal?: AbortSignal;
}

const DEFAULT_MODEL = "claude-sonnet-4-6-20250514";
const DEFAULT_MAX_TOKENS = 4096;

/**
 * Send stdin content + user query to Claude, stream the response to the
 * given writable stream (typically process.stdout), and return the full text.
 */
export async function analyzeWithAI(
  stdinContent: string,
  userQuery: string,
  options: AIOptions = {},
  out: Writable = process.stdout
): Promise<string> {
  const apiKey = process.env[ANTHROPIC_API_KEY_ENV];
  if (!apiKey) {
    out.write(
      `Error: ${ANTHROPIC_API_KEY_ENV} is not set.\n` +
      "Set it with: export ANTHROPIC_API_KEY=your-key-here\n" +
      "Get a key at: https://console.anthropic.com/\n"
    );
    process.exit(1);
  }

  const anthropic = new Anthropic({ apiKey });

  const systemPrompt =
    "You are a terminal assistant. The user has piped command output to you " +
    "and is asking a question about it. Analyze the output and answer concisely. " +
    "Focus on what matters — don't summarize the entire content unless asked. " +
    "Be direct and practical.\n\n" +
    "Use markdown formatting when it helps readability — tables, code blocks, lists.\n\n" +
    "IMPORTANT: Always respond in the same language the user wrote their question in. " +
    "If they ask in Chinese, answer in Chinese. If they ask in English, answer in English. " +
    "If they ask in Japanese, answer in Japanese. Match their language.";

  const messageContent = stdinContent
    ? [
        { type: "text" as const, text: "Here is the command output:\n\n```\n" + stdinContent + "\n```" },
        { type: "text" as const, text: "\n\nMy question: " + userQuery },
      ]
    : [{ type: "text" as const, text: userQuery }];

  const stream = anthropic.messages.stream(
    {
      model: options.model || DEFAULT_MODEL,
      max_tokens: options.maxTokens || DEFAULT_MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: "user", content: messageContent }],
    },
    { signal: options.signal }
  );

  const chunks: string[] = [];

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      out.write(event.delta.text);
      chunks.push(event.delta.text);
    }
  }

  out.write("\n");

  return chunks.join("");
}
