import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { createStudent, findStudentWithAttendance, getAttendanceStats, listStudents, saveAttendance, setStudentStatus } from "./db";
import { COACH_SESSION_COOKIE, createCoachSession, validateCoachCredentials } from "./coach-auth";

const attendanceStatus = z.enum(["present", "absent", "late"]);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  coach: router({
    login: publicProcedure.input(z.object({ username: z.string().min(1), password: z.string().min(1) })).mutation(({ input, ctx }) => {
      if (!validateCoachCredentials(input.username, input.password)) return { success: false as const };
      ctx.res.cookie(COACH_SESSION_COOKIE, createCoachSession(input.username), { ...getSessionCookieOptions(ctx.req), maxAge: 1000 * 60 * 60 * 12 });
      return { success: true as const };
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(COACH_SESSION_COOKIE, { ...getSessionCookieOptions(ctx.req), maxAge: -1 });
      return { success: true as const };
    }),
  }),
  attendance: router({
    lookup: publicProcedure.input(z.object({ studentId: z.string().min(3).max(32) })).query(({ input }) => findStudentWithAttendance(input.studentId)),
  }),
  admin: router({
    stats: adminProcedure.query(() => getAttendanceStats()),
    students: adminProcedure.query(() => listStudents()),
    addStudent: adminProcedure.input(z.object({ studentId: z.string().min(3), name: z.string().min(2), belt: z.string().min(2), joiningDate: z.coerce.date(), photoUrl: z.string().url().optional() })).mutation(({ input }) => createStudent(input)),
    setStudentStatus: adminProcedure.input(z.object({ id: z.number(), status: z.enum(["active", "disabled"]) })).mutation(({ input }) => setStudentStatus(input.id, input.status)),
    saveAttendance: adminProcedure.input(z.object({ studentId: z.number(), attendanceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), session: z.string().min(1).max(80), status: attendanceStatus })).mutation(({ input }) => saveAttendance(input)),
  }),
});

export type AppRouter = typeof appRouter;
