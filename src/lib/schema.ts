import * as z from "zod";

// Faculty Schema
export const facultySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "teacher", "student"], {
    required_error: "Please select a role",
  }),
  department: z.string(),
  image: z.string().optional(),
  imageCldPubId: z.string().optional(),
});

// Subject Schema
export const subjectSchema = z.object({
  name: z.string().min(2, "Subject name must be at least 2 characters"),
  code: z.string().min(1, "Subject code is required"),
  credits: z.number().min(1),
  departmentId: z.string(),
});

// Schedule Schema
export const scheduleSchema = z.object({
  day: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  subjectId: z.string(),
  classId: z.string(),
});

// Class Schema
export const classSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  capacity: z.number().int().positive(),
  roomNumber: z.string(),
  section: z.string().optional(),
  subjectId: z.string().min(1, "Subject is required"),
  teacherId: z.string(),
  bannerUrl: z.string().min(1, "Banner image is required"),
  bannerCldPubId: z.string().min(1, "Banner public id is required"),
});

// Enrollment Schema
export const enrollmentSchema = z.object({
  studentId: z.string(),
  classId: z.string(),
  status: z.enum(["active", "completed", "dropped"]).default("active"),
});