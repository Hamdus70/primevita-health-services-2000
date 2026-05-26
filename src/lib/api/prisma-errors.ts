import { Prisma } from "@prisma/client";
import { ConflictError, NotFoundError, InternalServerError } from "./errors";

export function handlePrismaError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return new ConflictError("Unique constraint violated");
      case "P2003":
        return new ConflictError("Foreign key constraint violated");
      case "P2025":
        return new NotFoundError("Record not found");
      default:
        return new InternalServerError("Database error");
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError || error instanceof Prisma.PrismaClientUnknownRequestError) {
    return new InternalServerError("Database operation failed");
  }

  return error;
}
