import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { createGalleryItem, createStudent, deleteAchievement, deleteAnnouncement, deleteGalleryItem, deleteStudent, findStudentWithAttendance, getAttendanceStats, getSiteContent, listGalleryItems, listStudents, saveAttendance, setStudentStatus, updateSiteContent } from "./db";
import { COACH_SESSION_COOKIE, createCoachSession, validateCoachCredentials } from "./coach-auth";
import { storagePut } from "./storage";

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
  site: router({
    content: publicProcedure.query(() => getSiteContent()),
    gallery: publicProcedure.query(() => listGalleryItems()),
  }),
  admin: router({
    stats: adminProcedure.query(() => getAttendanceStats()),
    students: adminProcedure.query(() => listStudents()),
    addStudent: adminProcedure.input(z.object({ studentId: z.string().min(3), name: z.string().min(2), belt: z.string().min(2), joiningDate: z.coerce.date(), photoUrl: z.string().url().optional() })).mutation(({ input }) => createStudent(input)),
    setStudentStatus: adminProcedure.input(z.object({ id: z.number(), status: z.enum(["active", "disabled"]) })).mutation(({ input }) => setStudentStatus(input.id, input.status)),
    deleteStudent: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteStudent(input.id)),
    saveAttendance: adminProcedure.input(z.object({ studentId: z.number(), attendanceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), session: z.string().min(1).max(80), status: attendanceStatus })).mutation(({ input }) => saveAttendance(input)),
    updateContent: adminProcedure.input(z.record(z.string().min(1).max(120), z.string().max(10000))).mutation(({ input }) => updateSiteContent(input)),
    addGalleryItem: adminProcedure.input(z.object({ category: z.string().min(1).max(50), title: z.string().min(1).max(180), imageUrl: z.string().url(), sortOrder: z.number().optional() })).mutation(({ input }) => createGalleryItem(input)),
    uploadGalleryImage: adminProcedure.input(z.object({ category: z.string().min(1).max(50), title: z.string().min(1).max(180), fileName: z.string().min(1).max(180), contentType: z.string().regex(/^image\/(jpeg|png|webp|gif)$/), base64: z.string().min(20).max(12_000_000) })).mutation(async ({ input }) => {
      const buffer = Buffer.from(input.base64, "base64");
      if (buffer.byteLength > 8_000_000) throw new Error("Image must be 8MB or smaller");
      const uploaded = await storagePut(`cobra-gallery/${input.fileName}`, buffer, input.contentType);
      await createGalleryItem({ category: input.category, title: input.title, imageUrl: uploaded.url });
      return { success: true as const, url: uploaded.url };
    }),
    deleteGalleryItem: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteGalleryItem(input.id)),
    deleteAchievement: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteAchievement(input.id)),
    deleteAnnouncement: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteAnnouncement(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
