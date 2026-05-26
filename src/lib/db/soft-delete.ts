import { getDb } from "./request-context";

export function excludeDeleted() {
  return {
    deleted_at: null
  };
}

export async function softDeleteById(modelName: string, id: string) {
  const db = getDb() as any;
  
  if (!db[modelName]) {
    throw new Error(`Model ${modelName} not found in database client`);
  }

  return db[modelName].update({
    where: { id },
    data: { deleted_at: new Date() }
  });
}

export async function restoreSoftDeleted(modelName: string, id: string) {
  const db = getDb() as any;

  if (!db[modelName]) {
    throw new Error(`Model ${modelName} not found in database client`);
  }

  return db[modelName].update({
    where: { id },
    data: { deleted_at: null }
  });
}
