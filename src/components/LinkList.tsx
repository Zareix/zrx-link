"use client";

import { type Link } from "@prisma/client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { MoreHorizontalIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ScrollAreaHorizontal } from "~/components/ui/scroll-area";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { deleteLink as deleteLinkAction } from "~/server/actions";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultVisibility?: VisibilityState;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  defaultVisibility = {},
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(defaultVisibility);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });

  return (
    <div className="max-w-[85vw] md:max-w-full">
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Columns</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollAreaHorizontal className="mx-auto">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollAreaHorizontal>
    </div>
  );
}

const LinkList = ({ links }: { links: Link[] }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const deleteLink = (link: Link) => {
    startTransition(() => {
      deleteLinkAction(link.slug)
        .then(() => {
          router.refresh();
        })
        .catch(console.error);
    });
  };

  return (
    <DataTable
      columns={[
        {
          accessorKey: "slug",
          header: "Slug",
          enableHiding: false,
          cell: ({ row }) => {
            const slug = "/" + row.getValue<string>("slug");
            return (
              <a
                href={slug}
                className="text-right font-medium text-blue-900 hover:text-blue-800"
              >
                {slug}
              </a>
            );
          },
        },
        {
          accessorKey: "url",
          header: "URL",
          enableHiding: false,
          cell: ({ row }) => {
            const url = row.getValue<string>("url");
            return (
              <a
                href={url}
                className="text-right font-medium text-blue-800 underline hover:text-blue-700"
              >
                {url}
              </a>
            );
          },
        },
        {
          id: "createdAt",
          header: "Created At",
          accessorFn: (link) =>
            new Date(link.createdAt).toLocaleString("fr-FR", {
              timeZone: "Europe/Paris",
            }),
        },
        {
          id: "updatedAt",
          header: "Updated At",
          accessorFn: (link) =>
            new Date(link.createdAt).toLocaleString("fr-FR", {
              timeZone: "Europe/Paris",
            }),
        },
        {
          id: "actions",
          enableHiding: false,
          cell: ({ row }) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    deleteLink(row.original);
                  }}
                  className="flex items-center gap-2"
                  disabled={isPending}
                >
                  <TrashIcon size={20} className="text-destructive" />
                  Delete link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        },
      ]}
      data={links}
    />
  );
};

export default LinkList;
