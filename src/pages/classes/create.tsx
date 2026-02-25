import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useBack, useSelect } from "@refinedev/core";

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

const teacherFallbackOptions = [
  { label: "Alex Johnson", value: "1" },
  { label: "Sarah Khan", value: "2" },
  { label: "Michael Lee", value: "3" },
];

const Create = () => {
  const back = useBack();

  const { options: teacherOptions } = useSelect({
    resource: "teachers",
    optionLabel: "name",
  });

  const { options: subjectOptions } = useSelect({
    resource: "subjects",
    optionLabel: "name",
  });

  const teacherSelectOptions =
    teacherOptions && teacherOptions.length > 0
      ? teacherOptions
      : teacherFallbackOptions;

  const form = useForm<z.infer<typeof classSchema>>({
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

  const { handleSubmit, formState: { isSubmitting, errors }, control, setValue } = form;

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
      console.log("Submitting Values:", values);
      // Add your create mutation here
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
                            {subjectOptions?.map((option: { label: string; value: string | number }) => (
                              <SelectItem key={option.value} value={option.value.toString()}>
                                {option.label}
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
                            {teacherSelectOptions.map((option: { label: string; value: string | number }) => (
                              <SelectItem key={option.value} value={option.value.toString()}>
                                {option.label}
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