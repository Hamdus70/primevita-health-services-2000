import { NextResponse } from "next/server";
import { getRequestId } from "./request-id";
import { AppError } from "./errors";

export function successResponse(data: any, message?: string, meta?: any) {
  return NextResponse.json({
    success: true,
    message,
    data,
    meta,
    requestId: getRequestId(),
    timestamp: new Date().toISOString()
  }, { status: 200 });
}

export function errorResponse(error: Error | AppError | unknown) {
  const isDevelopment = process.env.NODE_ENV !== "production";
  
  let statusCode = 500;
  let code = "INTERNAL_ERROR";
  let message = "Something went wrong";
  let details: any = undefined;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    code = error.code;
    message = error.exposeMessage || isDevelopment ? error.message : "Something went wrong";
    details = error.exposeMessage || isDevelopment ? error.details : undefined;
  } else if (error instanceof Error) {
    if (isDevelopment) {
      message = error.message;
    }
  }

  return NextResponse.json({
    success: false,
    error: {
      code,
      message,
      details
    },
    requestId: getRequestId(),
    timestamp: new Date().toISOString()
  }, { status: statusCode });
}
