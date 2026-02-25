export type Subject = {
  id: string;
  name: string;
  code: string;
  department: string;
  description: string;
  createdAt: string;
};

// 1. User Type (Students aur Teachers ke liye)
export type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  avatarUrl?: string;
  createdAt: string;
};

// 2. Classroom/Section Type
export type Classroom = {
  id: string;
  name: string;
  section: string;
  subjectId: string;
  teacherId: string;
  roomNumber?: string;
};

// 3. Attendance Type
export type Attendance = {
  id: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE";
  studentId: string;
  classId: string;
};

export type UploadWidgetValue = {
  url: string;
  publicId: string;
};