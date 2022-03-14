import { wrap } from 'comlink';
import type resize from './resize';
import { svgo } from './svgo';
export interface BridgeMethods {
  resize(signal: AbortSignal, ...args: Parameters<typeof resize>): Promise<ReturnType<typeof resize>>;
  svgo(signal: AbortSignal, ...args: Parameters<typeof svgo>): Promise<ReturnType<typeof svgo>>;
}

// eslint-disable-next-line
interface WorkerBridge extends BridgeMethods {}
/**
 * Throw an abort error if a signal is aborted.
 */
export function assertSignal(signal: AbortSignal) {
  if (signal.aborted) throw new DOMException('AbortError', 'AbortError');
}

/**
 * Take a signal and promise, and returns a promise that rejects with an AbortError if the abort is
 * signalled, otherwise resolves with the promise.
 */
export async function abortable<T>(signal: AbortSignal, promise: Promise<T>): Promise<T> {
  assertSignal(signal);
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      signal.addEventListener('abort', () => reject(new DOMException('AbortError', 'AbortError')));
    }),
  ]);
}

export const methodNames = ['resize', 'svgo'] as const;

/** How long the worker should be idle before terminating. */
const workerTimeout = 10_000;

class WorkerBridge {
  protected _queue = Promise.resolve() as Promise<unknown>;
  /** Worker instance associated with this processor. */
  protected _worker?: Worker;
  /** Comlinked worker API. */
  protected _workerApi?: any;
  /** ID from setTimeout */
  protected _workerTimeout?: any;

  protected _terminateWorker() {
    if (!this._worker) return;
    this._worker.terminate();
    this._worker = undefined;
    this._workerApi = undefined;
  }

  protected _startWorker() {
    this._worker = new Worker(new URL('./resize.worker', import.meta.url));
    this._workerApi = wrap(this._worker);
  }
}

for (const methodName of methodNames) {
  WorkerBridge.prototype[methodName] = function (this: WorkerBridge, signal: AbortSignal, ...args: any) {
    this._queue = this._queue
      // Ignore any errors in the queue
      .catch(() => {})
      .then(async () => {
        if (signal.aborted) throw new DOMException('AbortError', 'AbortError');

        clearTimeout(this._workerTimeout);
        if (!this._worker) this._startWorker();

        const onAbort = () => this._terminateWorker();
        signal.addEventListener('abort', onAbort);

        return abortable(
          signal,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore - TypeScript can't figure this out
          this._workerApi?.[methodName](...args),
        ).finally(() => {
          // No longer care about aborting - this task is complete.
          signal.removeEventListener('abort', onAbort);

          // Start a timer to clear up the worker.
          this._workerTimeout = setTimeout(() => {
            this._terminateWorker();
          }, workerTimeout);
        });
      });

    return this._queue;
  } as any;
}

export default WorkerBridge;
