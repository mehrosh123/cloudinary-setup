// index.ts
export * from "../ui/input";
export * from "../ui/select";
export const Departments =[
    'cs',
    'botany',
    'zoology',
    'maths',
];
export const Department_Options = Departments.map((dept) => ({
    value: dept,
    label: dept,
}));