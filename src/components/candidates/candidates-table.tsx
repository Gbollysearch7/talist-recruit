"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type RowSelectionState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Candidate {
  id: string;
  user_id: string;
  exa_id: string | null;
  name: string;
  title: string | null;
  company: string | null;
  location: string | null;
  linkedin_url: string | null;
  email: string | null;
  phone: string | null;
  skills: string[];
  experience_years: number | null;
  summary: string | null;
  source: string | null;
  raw_data: unknown;
  created_at: string;
  updated_at: string;
}

interface CandidatesTableProps {
  candidates: Candidate[];
  onView: (candidate: Candidate) => void;
  onDelete: (id: string) => void;
  rowSelection: RowSelectionState;
  onRowSelectionChange: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
}

// ─── Avatar ─────────────────────────────────────────────────────────────────

function CandidateAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex h-8 w-8 items-center justify-center border border-[#333] bg-white/5 text-xs font-medium text-white">
      {initials}
    </div>
  );
}

// ─── Columns ────────────────────────────────────────────────────────────────

function createColumns(
  onView: (candidate: Candidate) => void,
  onDelete: (id: string) => void
): ColumnDef<Candidate>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          className="h-4 w-4 accent-white cursor-pointer"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="h-4 w-4 accent-white cursor-pointer"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <button
          type="button"
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="h-3.5 w-3.5" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <CandidateAvatar name={row.original.name} />
          <div className="min-w-0">
            <p className="truncate font-medium text-white">
              {row.original.name}
            </p>
            {row.original.email && (
              <p className="truncate text-xs text-[rgba(255,255,255,0.6)]">
                {row.original.email}
              </p>
            )}
          </div>
        </div>
      ),
      size: 220,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <button
          type="button"
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="h-3.5 w-3.5" />
        </button>
      ),
      cell: ({ getValue }) => (
        <span className="truncate text-sm text-[rgba(255,255,255,0.6)]">
          {(getValue() as string | null) ?? "--"}
        </span>
      ),
      size: 180,
    },
    {
      accessorKey: "company",
      header: ({ column }) => (
        <button
          type="button"
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company
          <ArrowUpDown className="h-3.5 w-3.5" />
        </button>
      ),
      cell: ({ getValue }) => (
        <span className="truncate text-sm text-[rgba(255,255,255,0.6)]">
          {(getValue() as string | null) ?? "--"}
        </span>
      ),
      size: 160,
    },
    {
      accessorKey: "location",
      header: ({ column }) => (
        <button
          type="button"
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Location
          <ArrowUpDown className="h-3.5 w-3.5" />
        </button>
      ),
      cell: ({ getValue }) => (
        <span className="truncate text-sm text-[rgba(255,255,255,0.6)]">
          {(getValue() as string | null) ?? "--"}
        </span>
      ),
      size: 150,
    },
    {
      accessorKey: "skills",
      header: "Skills",
      cell: ({ getValue }) => {
        const skills = getValue() as string[];
        if (!skills || skills.length === 0) return <span className="text-[rgba(255,255,255,0.6)]">--</span>;
        const visible = skills.slice(0, 3);
        const remaining = skills.length - visible.length;
        return (
          <div className="flex flex-wrap gap-1">
            {visible.map((skill) => (
              <Badge key={skill} variant="outline" className="text-[10px] px-1.5 py-0">
                {skill}
              </Badge>
            ))}
            {remaining > 0 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                +{remaining}
              </Badge>
            )}
          </div>
        );
      },
      enableSorting: false,
      size: 200,
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <button
          type="button"
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Added
          <ArrowUpDown className="h-3.5 w-3.5" />
        </button>
      ),
      cell: ({ getValue }) => {
        const date = getValue() as string;
        return (
          <span className="text-sm text-[rgba(255,255,255,0.6)]">
            {format(new Date(date), "MMM d, yyyy")}
          </span>
        );
      },
      size: 120,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="p-1.5 text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            onClick={() => onView(row.original)}
            aria-label="View candidate"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="p-1.5 text-[rgba(255,255,255,0.6)] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            onClick={() => onDelete(row.original.id)}
            aria-label="Delete candidate"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
      enableSorting: false,
      size: 80,
    },
  ];
}

// ─── Component ──────────────────────────────────────────────────────────────

export function CandidatesTable({
  candidates,
  onView,
  onDelete,
  rowSelection,
  onRowSelectionChange,
  globalFilter,
  onGlobalFilterChange,
}: CandidatesTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const columns = React.useMemo(
    () => createColumns(onView, onDelete),
    [onView, onDelete]
  );

  const table = useReactTable({
    data: candidates,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange,
    onGlobalFilterChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    initialState: {
      pagination: { pageSize: 20 },
    },
  });

  return (
    <div className="flex flex-col gap-0">
      {/* Table */}
      <div className="overflow-x-auto border border-[#333]">
        <table className="w-full border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-[#333] bg-white/[0.03]"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[rgba(255,255,255,0.6)]"
                    style={{
                      width: header.getSize(),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-[#333] transition-colors",
                    row.getIsSelected()
                      ? "bg-white/[0.06]"
                      : "hover:bg-white/[0.03]"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-[rgba(255,255,255,0.6)]"
                >
                  <div className="flex flex-col items-center gap-2">
                    <User className="h-8 w-8 text-[rgba(255,255,255,0.3)]" />
                    <p>No candidates found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-x border-b border-[#333] bg-white/[0.02] px-4 py-3">
        <div className="text-xs text-[rgba(255,255,255,0.6)]">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[rgba(255,255,255,0.6)]">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
