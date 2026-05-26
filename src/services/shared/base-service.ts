import { NotFoundError, ConflictError } from "@/lib/api/errors";

export function assertExists<T>(entity: T | null | undefined, message = "Resource not found"): asserts entity is NonNullable<T> {
  if (entity === null || entity === undefined) {
    throw new NotFoundError(message);
  }
}

export function assertActive(entity: { active_status?: boolean | null, deleted_at?: Date | null }, message = "Resource is inactive or deleted") {
  if (entity.active_status !== true || entity.deleted_at !== null) {
    throw new ConflictError(message);
  }
}

export async function findUniqueOrThrow<T>(
  queryFn: () => Promise<T | null>,
  message = "Resource not found"
): Promise<T> {
  const result = await queryFn();
  assertExists(result, message);
  return result;
}

export function paginateQuery(page: number, limit: number, maxLimit = 100) {
  const actualLimit = Math.min(Math.max(1, limit), maxLimit);
  const actualPage = Math.max(1, page);
  const skip = (actualPage - 1) * actualLimit;

  return {
    skip,
    take: actualLimit
  };
}

export function buildPaginationMeta(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  };
}
