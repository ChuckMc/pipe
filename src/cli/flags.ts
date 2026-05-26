/**
 * Parse CLI flags and return options.
 * Errors are printed to stderr; the process exits with code 1 on invalid input.
 */
export interface PipeOptions {
  /** The user's question/query */
  query: string;
  /** Watch mode: continuously read stdin */
  watch: boolean;
  /** Model override */
  model?: string;
  /** Max tokens for response */
  maxTokens: number;
  /** Show help */
  help: boolean;
}

const HELP_TEXT = `
pipe — Pipe terminal output to AI

USAGE:
  <command> | pipe "your question"
  pipe "your question"              (then paste input, Ctrl+D when done)
  tail -f log | pipe --watch "analyze errors"

OPTIONS:
  --watch, -w       Continuously analyze stdin as new data arrives
  --model, -m       Claude model to use (default: claude-sonnet-4-6-20250514)
  --max-tokens      Max response tokens (default: 4096)
  --help, -h        Show this help

EXAMPLES:
  cat build.log | pipe "Why did the build fail?"
  kubectl get pods | pipe "Any pods in CrashLoopBackOff?"
  dmesg | pipe "Summarize hardware errors"
  tail -f server.log | pipe --watch "Alert me on ERROR or WARNING"
`;

export function parseArgs(args: string[]): PipeOptions {
  const result: PipeOptions = {
    query: "",
    watch: false,
    maxTokens: 4096,
    help: false,
  };

  const remaining: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--help":
      case "-h":
        result.help = true;
        break;
      case "--watch":
      case "-w":
        result.watch = true;
        break;
      case "--model":
      case "-m":
        result.model = args[++i];
        if (!result.model) {
          console.error("Error: --model requires a value");
          process.exit(1);
        }
        break;
      case "--max-tokens": {
        const val = args[++i];
        result.maxTokens = parseInt(val, 10);
        if (isNaN(result.maxTokens) || result.maxTokens < 1) {
          console.error("Error: --max-tokens must be a positive number");
          process.exit(1);
        }
        break;
      }
      default:
        if (arg.startsWith("-")) {
          console.error(`Error: Unknown flag: ${arg}\n`);
          console.error(HELP_TEXT.trim());
          process.exit(1);
        }
        remaining.push(arg);
        break;
    }
  }

  result.query = remaining.join(" ") || "";

  return result;
}

export function printHelp(): void {
  console.log(HELP_TEXT.trim());
}
