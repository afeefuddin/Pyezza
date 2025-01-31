import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import type { User } from "@repo/types/user";
import { getUser } from "@/actions/user";

export type NextHandler = (
  req: NextRequest,
  { params }: { params: Record<string, string | undefined> }
) => Promise<NextResponse | Response>;

export type NextRequestWithUser = NextRequest & { user: User };

export type NextHandlerWithUser = (
  req: NextRequestWithUser,
  params: { params: Record<string, string | undefined> }
) => Promise<NextResponse | Response>;

export function withUser(handler: NextHandlerWithUser) {
  return async (
    req: NextRequest,
    params: { params: Record<string, string | undefined> }
  ) => {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    (req as NextRequestWithUser).user = user;

    return handler(req as NextRequestWithUser, params);
  };
}

export function withError(handler: NextHandler): NextHandler {
  return async (req, params) => {
    try {
      return await handler(req, params);
    } catch (err) {
      if (err instanceof ZodError) {
        return NextResponse.json(
          { error: { issues: err.issues }, isKnownError: true },
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
