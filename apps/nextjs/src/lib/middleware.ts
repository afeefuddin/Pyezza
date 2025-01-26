import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export type NextHandler = (
  req: NextRequest,
  { params }: { params: Record<string, string | undefined> }
) => Promise<NextResponse | Response>;

export function withError(handler: NextHandler): NextHandler {
  return async (req, params) => {
    try {
      return await handler(req, params);
    } catch {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: { issues: error.issues }, isKnownError: true },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  };
}
