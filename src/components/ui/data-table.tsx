import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string | number;
  align?: "left" | "center" | "right";
}

export interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  rowKey?: keyof T | ((record: T) => string | number);
  className?: string;
  emptyMessage?: string;
}

type SortDirection = "asc" | "desc" | null;

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
  rowKey = "id",
  className,
  emptyMessage = "No data available"
}: DataTableProps<T>) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<string | number>>(new Set());
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: SortDirection;
  }>({ key: null, direction: null });

  // Get row key value
  const getRowKey = (record: T, index: number): string | number => {
    if (typeof rowKey === "function") {
      return rowKey(record);
    }
    return record[rowKey] ?? index;
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue === bValue) return 0;

      const isAscending = sortConfig.direction === "asc";
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return isAscending 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) return isAscending ? -1 : 1;
      if (aValue > bValue) return isAscending ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  // Handle sorting
  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    setSortConfig(prev => {
      if (prev.key === column.dataIndex) {
        // Cycle through: asc -> desc -> null -> asc
        const direction = prev.direction === "asc" ? "desc" : 
                         prev.direction === "desc" ? null : "asc";
        return { key: direction ? column.dataIndex : null, direction };
      } else {
        return { key: column.dataIndex, direction: "asc" };
      }
    });
  };

  // Handle row selection
  const handleRowSelect = (rowKey: string | number, checked: boolean) => {
    const newSelectedKeys = new Set(selectedRowKeys);
    
    if (checked) {
      newSelectedKeys.add(rowKey);
    } else {
      newSelectedKeys.delete(rowKey);
    }
    
    setSelectedRowKeys(newSelectedKeys);
    
    if (onRowSelect) {
      const selectedRows = data.filter((record, index) => 
        newSelectedKeys.has(getRowKey(record, index))
      );
      onRowSelect(selectedRows);
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = new Set(data.map((record, index) => getRowKey(record, index)));
      setSelectedRowKeys(allKeys);
      onRowSelect?.(data);
    } else {
      setSelectedRowKeys(new Set());
      onRowSelect?.([]);
    }
  };

  const isAllSelected = selectedRowKeys.size === data.length && data.length > 0;
  const isIndeterminate = selectedRowKeys.size > 0 && selectedRowKeys.size < data.length;

  // Render sort icon
  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    const isActive = sortConfig.key === column.dataIndex;
    const direction = isActive ? sortConfig.direction : null;

    return (
      <span className="ml-1 inline-flex flex-col">
        <ChevronUp 
          className={cn(
            "h-3 w-3 transition-colors",
            direction === "asc" ? "text-primary" : "text-muted-foreground/50"
          )} 
        />
        <ChevronDown 
          className={cn(
            "h-3 w-3 -mt-1 transition-colors",
            direction === "desc" ? "text-primary" : "text-muted-foreground/50"
          )} 
        />
      </span>
    );
  };

  if (loading) {
    return (
      <div className={cn("border rounded-md", className)}>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("border rounded-md overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-muted/30">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3 text-left">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all rows"
                    className={isIndeterminate ? "data-[state=checked]:bg-primary" : ""}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-left font-medium text-muted-foreground",
                    column.sortable && "cursor-pointer hover:text-foreground transition-colors",
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right"
                  )}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center">
                    <span>{column.title}</span>
                    {renderSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0)} 
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((record, index) => {
                const key = getRowKey(record, index);
                const isSelected = selectedRowKeys.has(key);
                
                return (
                  <tr
                    key={key}
                    className={cn(
                      "border-b last:border-b-0 hover:bg-muted/20 transition-colors",
                      isSelected && "bg-primary-light"
                    )}
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleRowSelect(key, !!checked)}
                          aria-label={`Select row ${index + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((column) => {
                      const value = record[column.dataIndex];
                      const content = column.render 
                        ? column.render(value, record, index)
                        : value?.toString() || "";
                      
                      return (
                        <td
                          key={`${key}-${column.key}`}
                          className={cn(
                            "px-4 py-3 text-sm",
                            column.align === "center" && "text-center",
                            column.align === "right" && "text-right"
                          )}
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { DataTable };