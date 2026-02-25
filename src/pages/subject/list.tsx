import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb';
import { ListView } from '@/components/refine-ui/views/list-view';
import React, { useState, useMemo } from 'react';
import { 
    Input, 
    Select, 
    SelectContent, 
    SelectTrigger, 
    SelectValue, 
    SelectItem, 
    Department_Options 
} from '@/components/refine-ui';
import { Search } from "lucide-react";
import { CreateButton } from "@refinedev/antd";
import { DataTable } from '@/components/refine-ui/data-table/data-table';
import { useTable } from "@refinedev/react-table";
import { Subject } from '@/Types'; 
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from "@/components/ui/badge";

function Subjectslist() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selecteddepartment, setSelectedDepartment] = useState("all");

    // Filtering logic - backend key "departmentName" use ki hai
    const departmentFilter = selecteddepartment !== "all" 
        ? [{ field: "departmentName", operator: "eq" as const, value: selecteddepartment }] 
        : [];
    
    const searchfilters = searchQuery 
        ? [{ field: "name", operator: "contains" as const, value: searchQuery }] 
        : [];

    const subjectTable = useTable<Subject>({
        columns: useMemo<ColumnDef<Subject>[]>(() => [
            {
                id: "code",
                accessorKey: "code",
                size: 100,
                header: () => <p className="column-title ml-2">Code</p>,
                cell: ({ getValue }) => (
                    <Badge variant="outline" className="text-black border-black">
                        {getValue<string>()}
                    </Badge>
                )
            },
            {
                id: "name",
                accessorKey: "name",
                size: 200,
                header: () => <p className="column-title ml-2">Name</p>,
            },
            {
                id: "department",
                // Backend JSON ke mutabiq accessorKey update ki hai
                accessorKey: "departmentName", 
                size: 150,
                header: () => <p className="column-title">Department</p>,
                cell: ({ getValue }) => (
                    <Badge variant="secondary">
                        {getValue<string>() || "N/A"}
                    </Badge>
                )
            },
            {
                id: "description",
                accessorKey: "description",
                size: 300,
                header: () => <p className="column-title">Description</p>,
                cell: ({ getValue }) => (
                    <span className="truncate line-clamp-2">
                        {getValue<string>() || "No description"}
                    </span>
                )
            }
        ], []),
        refineCoreProps: {
            resource: "subjects",
            // IMPORTANT: Backend response se 'data' array nikalne ke liye
            meta: {
                select: "data",
            },
            pagination: {
                pageSize: 10,
                mode: "server"
            },
            filters: {
                permanent: [...departmentFilter, ...searchfilters],
            },
            sorters: {
                initial: [{ field: "id", order: "desc" as const }]
            },
        }
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Subjects List</h1>
            <div className='into-row'>
                <p>Quick access to essential metrics and insights</p>
                <div className="action-row">
                    <div className="search-field">
                        <p className="mr-2">Search</p>
                        <Search className="search-icon" />
                        <Input
                            type="text"
                            placeholder="Search by name.."
                            className='pl-10 w-full'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className='flex gap-2 w-full sm:w-auto'>
                        <Select 
                            value={selecteddepartment} 
                            onValueChange={setSelectedDepartment}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                {Department_Options.map((department) => (
                                    <SelectItem key={department.value} value={department.value}>
                                        {department.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <CreateButton />
                    </div>
                </div>
            </div>
            {/* Table data yahan display hoga */}
            <DataTable table={subjectTable} />
        </ListView>
    );
}

export default Subjectslist;