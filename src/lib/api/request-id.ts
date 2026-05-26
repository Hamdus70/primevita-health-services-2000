import { AsyncLocalStorage } from "async_hooks";
import crypto from "crypto";

const requestIdContext = new AsyncLocalStorage<string>();

export function getRequestId(): string {
  return requestIdContext.getStore() ?? crypto.randomUUID();
}

export function runWithRequestId<T>(requestId: string, fn: () => T): T {
  return requestIdContext.run(requestId, fn);
}
