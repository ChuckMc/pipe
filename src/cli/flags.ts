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
pipe — Pipe terminal output to AI | 终端输出 → AI 分析

USAGE / 用法:
  <command> | pipe "your question"
  pipe "your question"              (then paste input / 粘贴内容后按 Ctrl+D)
  tail -f log | pipe --watch "analyze errors"

OPTIONS / 选项:
  --watch, -w       Continuously analyze stdin as new data arrives
                    持续监听 stdin，实时分析新增内容
  --model, -m       Claude model to use (default: claude-sonnet-4-6-20250514)
                    指定 Claude 模型
  --max-tokens      Max response tokens (default: 4096)
  --help, -h        Show this help / 显示帮助

EXAMPLES / 示例:
  cat build.log | pipe "Why did the build fail?"
  cat build.log | pipe "构建为什么失败了？"
  kubectl get pods | pipe "Any pods in CrashLoopBackOff?"
  dmesg | pipe "Summarize hardware errors"
  tail -f server.log | pipe --watch "Alert me on ERROR or WARNING"
  tail -f server.log | pipe -w "报告 ERROR 和慢查询"
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
