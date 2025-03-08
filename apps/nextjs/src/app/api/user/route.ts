import { withError, withUser } from "@/lib/middleware";
import { NextResponse } from "next/server";

export const GET = withError(
  withUser(async (req) => {
    const user = JSON.parse(JSON.stringify(req.user));
    delete user.id;
    delete user.externalProviderId;
    return NextResponse.json({
      result: user,
    });
  })
);
