import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function context(user: TrpcContext["user"] = null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

const admin: AuthenticatedUser = {
  id: 1,
  openId: "coach",
  email: "coach@example.com",
  name: "THE CPU",
  loginMethod: "manus",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

const member: AuthenticatedUser = { ...admin, id: 2, openId: "member", role: "user" };

describe("academy procedures", () => {
  it("rejects attendance lookup IDs that are too short", async () => {
    const caller = appRouter.createCaller(context());
    await expect(caller.attendance.lookup({ studentId: "x" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("protects admin stats from unauthenticated users", async () => {
    const caller = appRouter.createCaller(context());
    await expect(caller.admin.stats()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("protects admin stats from non-admin users", async () => {
    const caller = appRouter.createCaller(context(member));
    await expect(caller.admin.stats()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("protects permanent student deletion from unauthenticated users", async () => {
    const caller = appRouter.createCaller(context());
    await expect(caller.admin.deleteStudent({ id: 1 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("exposes the public CMS content endpoint", async () => {
    const caller = appRouter.createCaller(context());
    await expect(caller.site.content()).resolves.toBeDefined();
  });

  it("allows an admin to read fallback stats when the database is not configured", async () => {
    const caller = appRouter.createCaller(context(admin));
    await expect(caller.admin.stats()).resolves.toEqual({ totalStudents: 0, presentToday: 0, absentToday: 0, attendancePercent: 0 });
  });

  it("keeps typed TRPC errors available to callers", () => {
    const error = new TRPCError({ code: "FORBIDDEN", message: "Coach access required" });
    expect(error.code).toBe("FORBIDDEN");
  });
});
