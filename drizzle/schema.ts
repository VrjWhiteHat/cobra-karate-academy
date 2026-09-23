import { int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const students = mysqlTable("students", {
  id: int("id").autoincrement().primaryKey(),
  studentId: varchar("studentId", { length: 32 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  belt: varchar("belt", { length: 80 }).notNull(),
  joiningDate: timestamp("joiningDate").notNull(),
  status: mysqlEnum("status", ["active", "disabled"]).default("active").notNull(),
  photoUrl: text("photoUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const attendance = mysqlTable("attendance", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  attendanceDate: varchar("attendanceDate", { length: 10 }).notNull(),
  session: varchar("session", { length: 80 }).notNull().default("regular"),
  status: mysqlEnum("status", ["present", "absent", "late"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({ uniqueSession: uniqueIndex("attendance_student_date_session").on(table.studentId, table.attendanceDate, table.session) }));

export const achievements = mysqlTable("achievements", {
  id: int("id").autoincrement().primaryKey(),
  year: varchar("year", { length: 12 }).notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  detail: text("detail").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const galleryItems = mysqlTable("galleryItems", {
  id: int("id").autoincrement().primaryKey(),
  category: varchar("category", { length: 50 }).notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  imageUrl: text("imageUrl").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const announcements = mysqlTable("announcements", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  copy: text("copy").notNull(),
  publishDate: varchar("publishDate", { length: 40 }).notNull(),
  isPublished: int("isPublished").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const siteContent = mysqlTable("siteContent", {
  id: int("id").autoincrement().primaryKey(),
  contentKey: varchar("contentKey", { length: 120 }).notNull().unique(),
  contentValue: text("contentValue").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Student = typeof students.$inferSelect;
export type InsertStudent = typeof students.$inferInsert;
export type Attendance = typeof attendance.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type SiteContent = typeof siteContent.$inferSelect;
