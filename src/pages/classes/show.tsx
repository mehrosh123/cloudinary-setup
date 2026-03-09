import { useShow } from "@refinedev/core";
import { AdvancedImage } from "@cloudinary/react";

import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { bannerPhoto } from "@/lib/cloudinary";

type Teacher = {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  image?: string | null;
};

type Subject = {
  id: number;
  name: string | null;
  code: string | null;
  description?: string | null;
};

type Department = {
  id: number;
  name: string | null;
  description?: string | null;
};

type ClassDetails = {
  id: number;
  name: string | null;
  description?: string | null;
  status?: string | null;
  capacity?: number | null;
  roomNumber?: string | null;
  section?: string | null;
  inviteCode?: string | null;
  courseCode?: string | null;
  courseName?: string | null;
  bannerUrl?: string | null;
  bannerCldPubId?: string | null;
  classroom?: string | null;
  subjectId?: number | null;
  teacherId?: string | null;
  subjectName?: string | null;
  subjectCode?: string | null;
  subjectDescription?: string | null;
  teacherName?: string | null;
  teacherEmail?: string | null;
  teacherRole?: string | null;
  teacherImage?: string | null;
  departmentName?: string | null;
  departmentDescription?: string | null;
  subject?: Subject | null;
  teacher?: Teacher | null;
  department?: Department | null;
  schedules?: unknown[] | null;
};

const Show = () => {
  const { query } = useShow<ClassDetails>({ resource: "classes" });

  const classDetails = query.data?.data;
  const { isLoading, isError } = query;

  if (isLoading || isError || !classDetails) {
    return (
      <ShowView className="class-view class-show">
        <ShowViewHeader resource="classes" title="Class Details" />

        <p className="state-message">
          {isLoading
            ? "Loading class details..."
            : isError
              ? "Failed to load class details..."
              : "Class details not found"}
        </p>
      </ShowView>
    );
  }

  const resolvedSubject = classDetails.subject ?? (classDetails.subjectId || classDetails.subjectName || classDetails.subjectCode
    ? {
        id: classDetails.subjectId ?? 0,
        name: classDetails.subjectName ?? null,
        code: classDetails.subjectCode ?? null,
        description: classDetails.subjectDescription ?? null,
      }
    : null);

  const resolvedTeacher = classDetails.teacher ?? (classDetails.teacherId || classDetails.teacherName || classDetails.teacherEmail
    ? {
        id: classDetails.teacherId ?? "",
        name: classDetails.teacherName ?? null,
        email: classDetails.teacherEmail ?? null,
        role: classDetails.teacherRole ?? null,
        image: classDetails.teacherImage ?? null,
      }
    : null);

  const resolvedDepartment = classDetails.department ?? (classDetails.departmentName
    ? {
        id: 0,
        name: classDetails.departmentName,
        description: classDetails.departmentDescription ?? null,
      }
    : null);

  const teacherName = resolvedTeacher?.name ?? resolvedTeacher?.id ?? "Unknown";
  const teachersInitials = teacherName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const placeholderUrl = `https://placeholder.co/600x400?text=${encodeURIComponent(teachersInitials || "NA")}`;

  const {
    name,
    description,
    status,
    capacity,
    roomNumber,
    section,
    bannerUrl,
    schedules,
    inviteCode,
    courseCode,
    courseName,
    bannerCldPubId,
  } = classDetails;

  const resolvedCourseCode =
    courseCode ??
    resolvedSubject?.code ??
    (classDetails.subjectId ? `#${classDetails.subjectId}` : "N/A");
  const resolvedCourseName =
    courseName ??
    resolvedSubject?.name ??
    (classDetails.subjectId ? `Subject #${classDetails.subjectId}` : "N/A");
  const resolvedStatus = status ?? ((resolvedSubject || classDetails.subjectId) && (resolvedTeacher || classDetails.teacherId) ? "active" : "pending");
  const resolvedRoom = roomNumber ?? classDetails.classroom ?? null;
  const scheduleCount = Array.isArray(schedules) ? schedules.length : 0;

  return (
    <ShowView className="class-view class-show">
      <ShowViewHeader resource="classes" title="Class Details" />

      <div className="banner overflow-hidden rounded-md border">
        {bannerCldPubId ? (
          <AdvancedImage
            alt="Class Banner"
            cldImg={bannerPhoto(bannerCldPubId, name || "Class")}
            className="h-64 w-full object-cover"
          />
        ) : bannerUrl ? (
          <img
            src={bannerUrl}
            alt="Class Banner"
            className="h-64 w-full object-cover"
          />
        ) : (
          <div className="placeholder h-64 w-full" />
        )}
      </div>

      <Card className="details-card mt-4">
        <CardHeader className="space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-2xl">{name || "Untitled Class"}</CardTitle>
              <p className="text-muted-foreground mt-2">{description || "No description available."}</p>
            </div>
            <Badge variant="secondary" className="w-fit capitalize">
              {resolvedStatus}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Course: {resolvedCourseCode}</Badge>
            <Badge variant="outline">Invite: {inviteCode || "N/A"}</Badge>
            <Badge variant="outline">Schedules: {scheduleCount}</Badge>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2 rounded-md border p-4">
            <h3 className="font-semibold">Class Details</h3>
            <p className="text-sm">Class Name: {name || "Untitled Class"}</p>
            <p className="text-sm text-muted-foreground">Description: {description || "No description available."}</p>
          </div>

          <div className="space-y-2 rounded-md border p-4">
            <h3 className="font-semibold">Subject</h3>
            <p className="text-sm text-muted-foreground">{resolvedCourseName}</p>
            <p className="text-sm">Code: {resolvedCourseCode}</p>
            <p className="text-sm">Department: {resolvedDepartment?.name || "N/A"}</p>
          </div>

          <div className="space-y-2 rounded-md border p-4">
            <h3 className="font-semibold">Teacher</h3>
            <div>
              <img src={resolvedTeacher?.image ?? placeholderUrl} alt={teacherName} className="h-16 w-16 rounded-full object-cover" />
              <div>
                <p className="text-sm text-muted-foreground">{teacherName}</p>
                <p className="text-sm">{resolvedTeacher?.email || "N/A"}</p>
              </div>
            </div>
            <p className="text-sm">Role: {resolvedTeacher?.role || "N/A"}</p>
          </div>

          <div className="space-y-2 rounded-md border p-4">
            <h3 className="font-semibold">Classroom</h3>
            <p className="text-sm">Room: {resolvedRoom || "N/A"}</p>
            <p className="text-sm">Section: {section || "N/A"}</p>
            <p className="text-sm">Capacity: {capacity ?? 0}</p>
          </div>

          <div className="space-y-2 rounded-md border p-4">
            <h3 className="font-semibold">Department</h3>
            <p className="text-sm">{resolvedDepartment?.name || "N/A"}</p>
            <p className="text-sm text-muted-foreground">{resolvedDepartment?.description || "No department description available."}</p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="subject">
        <p>Subject</p>

        <div>
          <Badge variant="outline">Code: {resolvedSubject?.code || (classDetails.subjectId ? `#${classDetails.subjectId}` : "N/A")}</Badge>
          <p>{resolvedSubject?.name || (classDetails.subjectId ? `Subject #${classDetails.subjectId}` : "N/A")}</p>
          <p>{resolvedSubject?.description || "No subject description available."}</p>
        </div>
      </div>

      <Separator />

      <div className="join">
        <h2>Join Class</h2>

        <ol>
          <li>Ask your teacher for the invite code</li>
          <li>Click on "Join Class" button</li>
          <li>Paste the code and click "join"</li>
        </ol>

        <Button size="lg" className="w-full">Join Class</Button>
      </div>
    </ShowView>
  );
};

export default Show;