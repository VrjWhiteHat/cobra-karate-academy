import { and, asc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, attendance, students, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  textFields.forEach(field => { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; } });
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function findStudentWithAttendance(studentId: string) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(students).where(and(eq(students.studentId, studentId.toUpperCase()), eq(students.status, "active"))).limit(1);
  const student = result[0]; if (!student) return undefined;
  const history = await db.select().from(attendance).where(eq(attendance.studentId, student.id)).orderBy(asc(attendance.attendanceDate));
  const present = history.filter(item => item.status === "present").length;
  const absent = history.filter(item => item.status === "absent").length;
  const late = history.filter(item => item.status === "late").length;
  const total = history.length || 1;
  return { student, history, present, absent, late, attendance: Math.round(((present + late) / total) * 100) };
}

export async function listStudents() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(students).orderBy(asc(students.name));
}

export async function createStudent(input: { studentId: string; name: string; belt: string; joiningDate: Date; photoUrl?: string }) {
  const db = await getDb(); if (!db) throw new Error("Database not configured");
  await db.insert(students).values({ ...input, studentId: input.studentId.toUpperCase(), photoUrl: input.photoUrl ?? null });
  return { success: true } as const;
}

export async function setStudentStatus(id: number, status: "active" | "disabled") {
  const db = await getDb(); if (!db) throw new Error("Database not configured");
  await db.update(students).set({ status }).where(eq(students.id, id));
  return { success: true } as const;
}

export async function saveAttendance(input: { studentId: number; attendanceDate: string; session: string; status: "present" | "absent" | "late" }) {
  const db = await getDb(); if (!db) throw new Error("Database not configured");
  await db.insert(attendance).values(input).onDuplicateKeyUpdate({ set: { status: input.status } });
  return { success: true } as const;
}

export async function getAttendanceStats() {
  const db = await getDb(); if (!db) return { totalStudents: 0, presentToday: 0, absentToday: 0, attendancePercent: 0 };
  const [total] = await db.select({ count: sql<number>`count(*)` }).from(students).where(eq(students.status, "active"));
  return { totalStudents: Number(total?.count ?? 0), presentToday: 0, absentToday: 0, attendancePercent: 0 };
}
