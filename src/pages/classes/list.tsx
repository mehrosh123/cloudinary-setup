import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb';
import { ListView } from '@/components/refine-ui/views/list-view';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/refine-ui';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { CreateButton } from '@refinedev/antd';
import { DataTable } from '@/components/refine-ui/data-table/data-table';
import { useTable } from '@refinedev/react-table';
import { ColumnDef } from '@tanstack/react-table';
import { useList } from '@refinedev/core';
import React, { useMemo, useState } from 'react';

type ClassListItem = {
  id: number;
  name: string | null;
  section: string | null;
  roomNumber: string | null;
  capacity: number | null;
  bannerUrl: string | null;
  inviteCode: string | null;
  subjectId: number | null;
  teacherId: string | null;
  subject?: {
    id: number;
    name: string | null;
    code: string | null;
  } | null;
  teacher?: {
    id: string;
    name: string | null;
    email: string | null;
    role: string | null;
  } | null;
  students?: Array<{
    id: string;
    name: string;
    email: string;
    role: 'student';
  }>;
  studentsCount?: number;
};

function ClassesList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('all');
  const [selectedTeacherId, setSelectedTeacherId] = useState('all');

  const { result: subjectsResult, query: subjectsQuery } = useList<{ id: number; name: string | null; code: string | null }>({
    resource: 'subjects',
    pagination: {
      mode: 'off',
    },
    meta: {
      query: {
        limit: 1000,
      },
    },
  });

  const { result: teachersResult, query: teachersQuery } = useList<{ id: string; name: string | null; email: string | null }>({
    resource: 'users',
    pagination: {
      mode: 'off',
    },
    filters: [{ field: 'role', operator: 'eq', value: 'teacher' }],
    meta: {
      query: {
        role: 'teacher',
        limit: 1000,
      },
    },
  });

  const subjectRows =
    (subjectsResult?.data as Array<{ id: number; name: string | null; code: string | null }> | undefined) ??
    ((subjectsQuery.data as { data?: Array<{ id: number; name: string | null; code: string | null }> } | undefined)
      ?.data ??
      []);

  const teacherRows =
    (teachersResult?.data as Array<{ id: string; name: string | null; email: string | null }> | undefined) ??
    ((teachersQuery.data as { data?: Array<{ id: string; name: string | null; email: string | null }> } | undefined)
      ?.data ??
      []);

  const subjectOptions = useMemo(
    () =>
      subjectRows.map((subject: { id: number; name: string | null; code: string | null }) => ({
        value: String(subject.id),
        label: subject.code ? `${subject.name ?? 'Unnamed Subject'} (${subject.code})` : (subject.name ?? 'Unnamed Subject'),
      })),
    [subjectRows],
  );

  const teacherOptions = useMemo(
    () =>
      teacherRows.map((teacher: { id: string; name: string | null; email: string | null }) => ({
        value: teacher.id,
        label: teacher.name
          ? teacher.email
            ? `${teacher.name} (${teacher.email})`
            : teacher.name
          : (teacher.email ?? teacher.id),
      })),
    [teacherRows],
  );

  const searchfilters = searchQuery
    ? [{ field: 'search', operator: 'eq' as const, value: searchQuery }]
    : [];

  const subjectFilters =
    selectedSubjectId !== 'all'
      ? [{ field: 'subjectId', operator: 'eq' as const, value: selectedSubjectId }]
      : [];

  const teacherFilters =
    selectedTeacherId !== 'all'
      ? [{ field: 'teacherId', operator: 'eq' as const, value: selectedTeacherId }]
      : [];

  const classTable = useTable<ClassListItem>({
    columns: useMemo<ColumnDef<ClassListItem>[]>(
      () => [
        {
          id: 'bannerUrl',
          accessorKey: 'bannerUrl',
          size: 220,
          header: () => <p className="column-title ml-2">Banner</p>,
          cell: ({ getValue }) => {
            const bannerUrl = getValue<string | null>();

            if (!bannerUrl) {
              return <span className="text-muted-foreground">No banner</span>;
            }

            return (
              <img
                src={bannerUrl}
                alt="Class banner"
                className="h-14 w-28 rounded object-cover border"
              />
            );
          },
        },
        {
          id: 'name',
          accessorKey: 'name',
          size: 220,
          header: () => <p className="column-title ml-2">Class</p>,
          cell: ({ row }) => (
            <div className="flex flex-col">
              <span className="font-medium">{row.original.name || 'Untitled Class'}</span>
              {row.original.section ? (
                <span className="text-xs text-muted-foreground">Section {row.original.section}</span>
              ) : null}
            </div>
          ),
        },
        {
          id: 'status',
          size: 140,
          header: () => <p className="column-title">Status</p>,
          cell: ({ row }) => {
            const hasTeacher = Boolean(row.original.teacherId);
            const hasSubject = Boolean(row.original.subjectId);
            const status = hasTeacher && hasSubject ? 'Active' : 'Pending';

            return (
              <Badge variant={status === 'Active' ? 'secondary' : 'outline'} className="text-black border-black">
                {status}
              </Badge>
            );
          },
        },
        {
          id: 'subject',
          size: 220,
          header: () => <p className="column-title">Subject</p>,
          cell: ({ row }) => {
            const subject = row.original.subject;

            if (!subject) {
              return <span className="text-muted-foreground">No subject</span>;
            }

            return (
              <div className="flex flex-col">
                <span>{subject.name || 'Unnamed Subject'}</span>
                {subject.code ? <span className="text-xs text-muted-foreground">{subject.code}</span> : null}
              </div>
            );
          },
        },
      ],
      [],
    ),
    refineCoreProps: {
      resource: 'classes',
      meta: {
        select: 'data',
      },
      pagination: {
        pageSize: 10,
        mode: 'server',
      },
      filters: {
        permanent: [...subjectFilters, ...teacherFilters, ...searchfilters],
      },
      sorters: {
        initial: [{ field: 'id', order: 'desc' as const }],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Classes List</h1>
      <div className="into-row">
        <p>Quick access to classes, teachers, subjects and students details</p>
        <div className="action-row">
          <div className="search-field">
            <p className="mr-2">Search</p>
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by class name.."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjectOptions.map((subject) => (
                  <SelectItem key={subject.value} value={subject.value}>
                    {subject.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Filter by teacher" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teachers</SelectItem>
                {teacherOptions.map((teacher) => (
                  <SelectItem key={teacher.value} value={teacher.value}>
                    {teacher.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateButton />
          </div>
        </div>
      </div>
      <DataTable table={classTable} />
    </ListView>
  );
}

export default ClassesList;