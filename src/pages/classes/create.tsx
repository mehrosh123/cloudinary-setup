import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMemo } from "react";
import { useBack, useList, type HttpError } from "@refinedev/core";  

// UI Components
import { CreateView } from "@/components/refine-ui/views/create-view.tsx";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

// Custom Upload Widget
import UploadWidget from "@/components/upload-widget.tsx";
import type { UploadWidgetValue } from "@/Types";

// Schema Import
import { classSchema } from "@/lib/schema.ts";

const MANUAL_TEACHER_OPTIONS = [
  {
    value: "teacher-001",
    label: "Aisha Khan (aisha.khan@school.edu)",
    secondary: "TEACHER • teacher-001",
  },
  {
    value: "teacher-002",
    label: "Bilal Ahmed (bilal.ahmed@school.edu)",
    secondary: "TEACHER • teacher-002",
  },
  {
    value: "teacher-003",
    label: "Sara Noor (sara.noor@school.edu)",
    secondary: "TEACHER • teacher-003",
  },
] as const;

const MANUAL_SUBJECT_OPTIONS = [
  {
    value: "1001",
    label: "Mathematics (MATH-101)",
    secondary: "Science Department",
  },
  {
    value: "1002",
    label: "Physics (PHY-101)",
    secondary: "Science Department",
  },
  {
    value: "1003",
    label: "English Literature (ENG-101)",
    secondary: "Humanities Department",
  },
] as const;

const Create = () => {
  const back = useBack();

  const { result: teacherResult, query: teacherQuery } = useList({
    resource: "users",
    pagination: {
      mode: "off",
    },
    filters: [{ field: "role", operator: "eq", value: "teacher" }],
    meta: {
      query: {
        role: "teacher",
        limit: 1000,
      },
    },
  });

  const { result: subjectResult, query: subjectQuery } = useList({
    resource: "subjects",
    pagination: {
      mode: "off",
    },
    meta: {
      query: {
        limit: 1000,
      },
    },
  });

  const teacherRows =
    (teacherResult?.data as Array<Record<string, unknown>> | undefined) ??
    ((teacherQuery.data as { data?: Array<Record<string, unknown>> } | undefined)?.data as
      | Array<Record<string, unknown>>
      | undefined) ??
    ((teacherQuery.data as Array<Record<string, unknown>> | undefined) ?? []);

  const subjectRows =
    (subjectResult?.data as Array<Record<string, unknown>> | undefined) ??
    ((subjectQuery.data as { data?: Array<Record<string, unknown>> } | undefined)?.data as
      | Array<Record<string, unknown>>
      | undefined) ??
    ((subjectQuery.data as Array<Record<string, unknown>> | undefined) ?? []);

  const teacherOptions = useMemo(
    () =>
      teacherRows
        .map((teacher: Record<string, unknown>) => {
          const teacherId = String(
            teacher.id ?? teacher.userId ?? teacher.teacherId ?? teacher.value ?? "",
          ).trim();
          const teacherName = String(
            teacher.name ?? teacher.fullName ?? teacher.teacherName ?? teacher.username ?? "",
          ).trim();
          const teacherEmail = String(
            teacher.email ?? teacher.teacherEmail ?? teacher.userEmail ?? "",
          ).trim();
          const teacherRole = String(teacher.role ?? teacher.teacherRole ?? "").trim();

          const label =
            teacherName && teacherEmail
              ? `${teacherName} (${teacherEmail})`
              : teacherName || teacherEmail || teacherId;

          const secondary = [teacherEmail, teacherRole.toUpperCase(), teacherId]
            .filter(Boolean)
            .join(" • ");

          return {
            label,
            secondary,
            value: teacherId,
          };
        })
        .filter((teacher: { label: string; value: string }) => teacher.value && teacher.label),
    [teacherRows],
  );

  const teacherOptionsToShow = teacherOptions.length > 0 ? teacherOptions : [...MANUAL_TEACHER_OPTIONS];

  const subjectOptions = useMemo(
    () =>
      subjectRows
        .map((subject: Record<string, unknown>) => {
          const subjectId = String(subject.id ?? "");
          const subjectName = String(subject.name ?? "").trim();
          const subjectCode = String(subject.code ?? "").trim();
          const departmentName = String(subject.departmentName ?? "").trim();
          const teachers = Array.isArray(subject.teachers)
            ? (subject.teachers as Array<Record<string, unknown>>)
            : [];

          const teacherNames = teachers
            .map((teacher) => String(teacher?.name ?? "").trim())
            .filter(Boolean)
            .join(", ");

          const label = subjectCode
            ? `${subjectName} (${subjectCode})`
            : subjectName || subjectId;

          const secondary = [departmentName, teacherNames]
            .filter(Boolean)
            .join(" • ");

          return {
            label,
            secondary,
            value: subjectId,
          };
        })
        .filter((subject: { label: string; value: string }) => subject.value && subject.label),
    [subjectRows],
  );

  const subjectOptionsToShow = subjectOptions.length > 0 ? subjectOptions : [...MANUAL_SUBJECT_OPTIONS];

  const form = useForm<
    z.infer<typeof classSchema>,
    HttpError,
    z.infer<typeof classSchema>
  >({
    refineCoreProps: {
      resource: "classes",
    },
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: "",
      capacity: 1,
      roomNumber: "",
      section: "",
      teacherId: "",
      subjectId: "",
      bannerUrl: "",
      bannerCldPubId: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
    setValue,
    refineCore: { onFinish },
  } = form;

  const bannerPublicId = form.watch("bannerCldPubId");

  const setBannerImage = (
    file: UploadWidgetValue | null,
    field: { onChange: (value: string) => void },
  ) => {
    if (file) {
      field.onChange(file.url);
      setValue("bannerCldPubId", file.publicId, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      field.onChange("");
      setValue("bannerCldPubId", "", {
        shouldValidate: true,
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof classSchema>) => {
    try {
      await onFinish({
        ...values,
        capacity: Number(values.capacity),
        subjectId: String(values.subjectId),
        teacherId: String(values.teacherId),
      });
    } catch (e) {
      console.log("Error creating class:", e);
    }
  };

  return (
    <CreateView className="class-view">
      <Breadcrumb />
      <h1 className="page-title text-2xl font-bold">Create a Class</h1>
      
      <div className="intro-row flex justify-between items-center my-4">
        <p className="text-muted-foreground">Provide information below to add a class.</p>
        <Button onClick={() => back()} variant="outline">Go Back</Button>
      </div>
      
      <Separator />

      <div className="my-4 flex items-center justify-center">
        <Card className="class-form-card w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Fill out the form</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="mt-7">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                
                {/* Banner Image */}
                <FormField
                  control={control}
                  name="bannerUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner Image <span className="text-orange-600">*</span></FormLabel>
                      <FormControl>
                        <UploadWidget 
                          value={field.value ? { 
                            url: field.value, 
                            publicId: bannerPublicId ?? '' 
                          } : null}
                          onChange={(file: UploadWidgetValue | null) => setBannerImage(file, field)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Class Name */}
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Introduction to Biology - Section A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Subject Dropdown */}
                  <FormField
                    control={control}
                    name="subjectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ? String(field.value) : undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subjectOptionsToShow.map((option: { label: string; secondary?: string; value: string | number }) => (
                              <SelectItem key={option.value} value={option.value.toString()}>
                                <div className="flex flex-col">
                                  <span>{option.label}</span>
                                  {option.secondary ? (
                                    <span className="text-xs text-muted-foreground">{option.secondary}</span>
                                  ) : null}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Teacher Dropdown */}
                  <FormField
                    control={control}
                    name="teacherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teacher *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ? String(field.value) : undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a teacher" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teacherOptionsToShow.map((option: { label: string; secondary?: string; value: string | number }) => (
                              <SelectItem key={option.value} value={option.value.toString()}>
                                <div className="flex flex-col">
                                  <span>{option.label}</span>
                                  {option.secondary ? (
                                    <span className="text-xs text-muted-foreground">{option.secondary}</span>
                                  ) : null}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Capacity */}
                  <FormField
                    control={control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Room Number */}
                  <FormField
                    control={control}
                    name="roomNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 101" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Section */}
                  <FormField
                    control={control}
                    name="section"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Submit"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </CreateView>
  );
};

export default Create;