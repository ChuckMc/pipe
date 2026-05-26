/**
 * Stream watcher — reads stdin continuously in --watch mode.
 */

export interface WatchOptions {
  onData: (chunk: string) => void;
  onError: (error: Error) => void;
  signal?: AbortSignal;
}

/**
 * Continuously read stdin and call onData for each chunk.
 * Resolves when stdin ends or the abort signal fires.
 */
export function startWatching(
  stream: NodeJS.ReadStream,
  options: WatchOptions
): Promise<void> {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const CHUNK_THRESHOLD = 2000; // characters before triggering analysis
    const FLUSH_INTERVAL = 5000;  // ms — flush on inactivity

    let flushTimer: ReturnType<typeof setTimeout> | null = null;

    const flush = () => {
      if (buffer.length > 0) {
        options.onData(buffer);
        buffer = "";
      }
    };

    const scheduleFlush = () => {
      if (flushTimer) clearTimeout(flushTimer);
      flushTimer = setTimeout(flush, FLUSH_INTERVAL);
    };

    stream.on("data", (chunk: Buffer) => {
      const text = chunk.toString("utf-8");
      buffer += text;

      if (buffer.length >= CHUNK_THRESHOLD) {
        flush();
      }
      scheduleFlush();
    });

    stream.on("end", () => {
      if (flushTimer) clearTimeout(flushTimer);
      flush();
      resolve();
    });

    stream.on("error", (err) => {
      options.onError(err);
      reject(err);
    });

    if (options.signal) {
      options.signal.addEventListener("abort", () => {
        if (flushTimer) clearTimeout(flushTimer);
        flush();
        resolve();
      });
    }
  });
}
