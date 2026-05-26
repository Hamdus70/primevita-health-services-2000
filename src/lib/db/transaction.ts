import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { PrismaTransactionClient, getDb, runWithTransactionContext } from "./request-context";

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 100;

export async function withTransaction<T>(
  work: (tx: PrismaTransactionClient) => Promise<T>,
  options: { maxRetries?: number } = {}
): Promise<T> {
  const retries = options.maxRetries ?? MAX_RETRIES;
  let attempt = 0;

  // If already inside a transaction context, execute work directly using the current transaction
  const currentDb = getDb();
  if (currentDb !== prisma) {
    return work(currentDb);
  }

  while (attempt < retries) {
    try {
      return await prisma.$transaction(async (tx) => {
        return await runWithTransactionContext(tx, () => work(tx));
      });
    } catch (error: any) {
      attempt++;
      
      const isDeadlock = error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034";
      const isTransient = error.message?.includes("deadlock") || 
                          error.message?.includes("serialization failure") || 
                          error.message?.includes("connection reset");

      if ((isDeadlock || isTransient) && attempt < retries) {
        const delayMs = BASE_DELAY_MS * Math.pow(3, attempt - 1); // 100ms, 300ms, 900ms
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }
      
      throw error;
    }
  }
  
  throw new Error("Transaction failed after maximum retries");
}
