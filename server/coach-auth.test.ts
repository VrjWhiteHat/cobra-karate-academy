import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function context() {
  const cookies: Array<{ name: string; value: string }> = [];
  const ctx: TrpcContext = {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string) => cookies.push({ name, value }),
      clearCookie: () => undefined,
    } as TrpcContext["res"],
  };
  return { ctx, cookies };
}

describe("coach login procedure", () => {
  it("accepts the configured coach username and password", async () => {
    const { ctx, cookies } = context();
    const result = await appRouter.createCaller(ctx).coach.login({ username: "theCPU", password: "theVRJ8" });
    expect(result).toEqual({ success: true });
    expect(cookies[0]?.name).toBe("cobra_coach_session");
  });

  it("rejects an incorrect password without setting a session", async () => {
    const { ctx, cookies } = context();
    const result = await appRouter.createCaller(ctx).coach.login({ username: "theCPU", password: "wrong-password" });
    expect(result).toEqual({ success: false });
    expect(cookies).toHaveLength(0);
  });
});
