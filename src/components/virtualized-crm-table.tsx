"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import type { CrmRecord } from "@/lib/api";

interface VirtualizedCrmTableProps {
  records: CrmRecord[];
}

const columns = [
  "created_at",
  "name",
  "email",
  "country_code",
  "mobile_without_country_code",
  "company",
  "city",
  "state",
  "country",
  "lead_owner",
  "crm_status",
  "crm_note",
  "data_source",
  "possession_time",
  "description",
] as const satisfies readonly (keyof CrmRecord)[];

export function VirtualizedCrmTable({
  records,
}: VirtualizedCrmTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: records.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 49,
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200">
      <div
        ref={scrollRef}
        className="max-h-[430px] overflow-auto"
      >
        <table className="w-full min-w-max border-collapse text-left text-sm">
          <thead className="sticky top-0 z-20 bg-zinc-100">
            <tr>
              <th className="whitespace-nowrap border-b border-r border-zinc-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-600">
                Row
              </th>

              {columns.map((column) => (
                <th
                  key={column}
                  className="whitespace-nowrap border-b border-r border-zinc-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-600 last:border-r-0"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {virtualRows.length > 0 && (
              <tr aria-hidden="true">
                <td
                  colSpan={columns.length + 1}
                  style={{
                    height: `${virtualRows[0]?.start ?? 0}px`,
                    padding: 0,
                    border: 0,
                  }}
                />
              </tr>
            )}

            {virtualRows.map((virtualRow) => {
              const record = records[virtualRow.index];

              if (!record) {
                return null;
              }

              return (
                <tr
                  key={virtualRow.key}
                  className="border-b border-zinc-100 hover:bg-zinc-50"
                >
                  <td className="whitespace-nowrap border-r border-zinc-100 px-4 py-3 text-xs text-zinc-400">
                    {virtualRow.index + 1}
                  </td>

                  {columns.map((column) => (
                    <td
                      key={column}
                      title={record[column] || ""}
                      className="max-w-72 truncate whitespace-nowrap border-r border-zinc-100 px-4 py-3 text-zinc-700 last:border-r-0"
                    >
                      {record[column] || (
                        <span className="text-zinc-300">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}

            {virtualRows.length > 0 && (
              <tr aria-hidden="true">
                <td
                  colSpan={columns.length + 1}
                  style={{
                    height: `${
                      rowVirtualizer.getTotalSize() -
                      (virtualRows[
                        virtualRows.length - 1
                      ]?.end ?? 0)
                    }px`,
                    padding: 0,
                    border: 0,
                  }}
                />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}