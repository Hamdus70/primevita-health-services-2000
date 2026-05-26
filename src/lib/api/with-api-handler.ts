import { NextRequest } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { runWithRequestId } from "./request-id";
import { errorResponse, successResponse } from "./response";
import { handlePrismaError } from "./prisma-errors";
import { ValidationError, AuthenticationError, AuthorizationError } from "./errors";
import { getCurrentUser } from "@/lib/auth/session";
import { requireAuth, requireStaff } from "@/lib/auth/guards";
import { createAuditLog } from "@/lib/audit/log";
import { runWithTransactionContext } from "@/lib/db/request-context";
import { prisma } from "@/lib/db/prisma";
import { AuditActionType } from "@prisma/client";

interface ApiContext {
  params: Record<string, string>;
  user?: any;
  validData?: any;
}

interface ApiHandlerOptions<T extends z.ZodTypeAny> {
  requireAuth?: boolean;
  requireStaff?: boolean;
  schema?: T;
  auditTable?: string;
}

export function withApiHandler<T extends z.ZodTypeAny>(
  handler: (req: NextRequest, ctx: ApiContext) => Promise<any> | any,
  options: ApiHandlerOptions<T> = {}
) {
  return async function wrappedHandler(req: NextRequest, { params }: { params?: any } = {}) {
    const requestId = crypto.randomUUID();

    return runWithRequestId(requestId, async () => {
      try {
        const resolvedParams = params ? await params : {};
        const ctx: ApiContext = { params: resolvedParams };

        if (options.requireStaff) {
          try {
            ctx.user = await requireStaff();
          } catch (e: any) {
            throw new AuthorizationError(e.message);
          }
        } else if (options.requireAuth) {
          try {
            ctx.user = await requireAuth();
          } catch (e: any) {
            throw new AuthenticationError(e.message);
          }
        } else {
          ctx.user = await getCurrentUser();
        }

        if (options.schema) {
          let body = null;
          try {
            body = await req.json();
          } catch {
            body = null;
          }
          try {
            ctx.validData = await options.schema.parseAsync(body);
          } catch (error) {
            if (error instanceof z.ZodError) {
              throw new ValidationError("Validation failed", (error as any).errors || error.issues);
            }
            throw new ValidationError("Invalid JSON payload");
          }
        }

        const result = await runWithTransactionContext(prisma, async () => {
          return await handler(req, ctx);
        });

        const method = req.method;
        if (ctx.user && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
          let actionType: AuditActionType = "UPDATE";
          if (method === "POST") actionType = "CREATE";
          else if (method === "DELETE") actionType = "DELETE";

          createAuditLog({
            actorIdentifier: ctx.user.username || ctx.user.id || "SYSTEM",
            actorRole: ctx.user.linkedUserType || "UNKNOWN",
            actionType,
            affectedTable: options.auditTable || "UNKNOWN",
            ipAddress: req.headers.get("x-forwarded-for") || undefined,
            userAgent: req.headers.get("user-agent") || undefined,
          });
        }

        if (result instanceof Response) {
          return result;
        }

        return successResponse(result);

      } catch (error: unknown) {
        const mappedError = handlePrismaError(error);
        return errorResponse(mappedError);
      }
    });
  };
}
