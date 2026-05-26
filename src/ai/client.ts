import Anthropic from "@anthropic-ai/sdk";

const ANTHROPIC_API_KEY_ENV = "ANTHROPIC_API_KEY";

export interface AIOptions {
  model?: string;
  maxTokens?: number;
  signal?: AbortSignal;
}

const DEFAULT_MODEL = "claude-sonnet-4-6-20250514";
const DEFAULT_MAX_TOKENS = 4096;

/**
 * Send stdin content + user query to Claude, stream the response to stdout.
 * Returns the full response text for programmatic use.
 */
export async function analyzeWithAI(
  stdinContent: string,
  userQuery: string,
  options: AIOptions = {}
): Promise<string> {
  const apiKey = process.env[ANTHROPIC_API_KEY_ENV];
  if (!apiKey) {
    console.error(
      `Error: ${ANTHROPIC_API_KEY_ENV} is not set.\n` +
      "Set it with: export ANTHROPIC_API_KEY=your-key-here\n" +
      "Get a key at: https://console.anthropic.com/"
    );
    process.exit(1);
  }

  const anthropic = new Anthropic({ apiKey });

  const systemPrompt =
    "You are a terminal assistant. The user has piped command output to you " +
    "and is asking a question about it. Analyze the output and answer concisely. " +
    "Focus on what matters — don't summarize the entire content unless asked. " +
    "Be direct and practical.";

  const messageContent = stdinContent
    ? [
        { type: "text" as const, text: "Here is the command output:\n\n```\n" + stdinContent + "\n```" },
        { type: "text" as const, text: "\n\nMy question: " + userQuery },
      ]
    : [{ type: "text" as const, text: userQuery }];

  const stream = await anthropic.messages.stream(
    {
      model: options.model || DEFAULT_MODEL,
      max_tokens: options.maxTokens || DEFAULT_MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: "user", content: messageContent }],
    },
    { signal: options.signal }
  );

  const response = await stream.finalMessage();
  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");

  return text;
}
