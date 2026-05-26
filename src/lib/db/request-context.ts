import { PrismaClient } from "@prisma/client";
import { AsyncLocalStorage } from "async_hooks";
import { prisma } from "./prisma";

export type PrismaTransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

const transactionContext = new AsyncLocalStorage<PrismaTransactionClient>();

export function getDb(): PrismaTransactionClient | PrismaClient {
  const tx = transactionContext.getStore();
  return tx ?? prisma;
}

export function runWithTransactionContext<T>(
  tx: PrismaTransactionClient,
  promise: () => Promise<T>
): Promise<T> {
  return transactionContext.run(tx, promise);
}
