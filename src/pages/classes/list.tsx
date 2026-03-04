import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb';
import { ListView } from '@/components/refine-ui/views/list-view';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { CreateButton } from '@refinedev/antd';
import { DataTable } from '@/components/refine-ui/data-table/data-table';
import { useTable } from '@refinedev/react-table';
import { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

type ClassListItem = {
  id: number;
  name: string | null;
  section: string | null;
  roomNumber: string | null;
  capacity: number | null;
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

  const searchfilters = searchQuery
    ? [{ field: 'search', operator: 'eq' as const, value: searchQuery }]
    : [];

  const classTable = useTable<ClassListItem>({
    columns: useMemo<ColumnDef<ClassListItem>[]>(
      () => [
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
        {
          id: 'teacher',
          size: 220,
          header: () => <p className="column-title">Teacher</p>,
          cell: ({ row }) => {
            const teacher = row.original.teacher;

            if (!teacher) {
              return <span className="text-muted-foreground">No teacher assigned</span>;
            }

            return (
              <div className="flex flex-col">
                <span>{teacher.name || teacher.id}</span>
                {teacher.email ? <span className="text-xs text-muted-foreground">{teacher.email}</span> : null}
              </div>
            );
          },
        },
        {
          id: 'students',
          size: 240,
          header: () => <p className="column-title">Students</p>,
          cell: ({ row }) => {
            const students = row.original.students ?? [];
            const studentsCount = row.original.studentsCount ?? students.length;

            if (!students.length) {
              return (
                <div className="flex flex-col">
                  <span className="text-muted-foreground">No students</span>
                  <span className="text-xs text-muted-foreground">Count: {studentsCount}</span>
                </div>
              );
            }

            return (
              <div className="flex flex-col">
                <span className="truncate line-clamp-2">{students.map((student) => student.name).join(', ')}</span>
                <span className="text-xs text-muted-foreground">Count: {studentsCount}</span>
              </div>
            );
          },
        },
        {
          id: 'room',
          size: 180,
          header: () => <p className="column-title">Room / Capacity</p>,
          cell: ({ row }) => (
            <div className="flex flex-col">
              <span>{row.original.roomNumber || 'N/A'}</span>
              <span className="text-xs text-muted-foreground">Capacity: {row.original.capacity ?? 0}</span>
            </div>
          ),
        },
        {
          id: 'inviteCode',
          accessorKey: 'inviteCode',
          size: 140,
          header: () => <p className="column-title">Invite</p>,
          cell: ({ getValue }) => (
            <Badge variant="outline" className="text-black border-black">
              {String(getValue<string>() || 'N/A')}
            </Badge>
          ),
        },
      ],
      [],
    ),
    refineCoreProps: {
      resource: 'classes',
      pagination: {
        pageSize: 10,
        mode: 'server',
      },
      filters: {
        permanent: [...searchfilters],
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
          <CreateButton />
        </div>
      </div>
      <DataTable table={classTable} />
    </ListView>
  );
}

export default ClassesList;