import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useGetTransactionLogsQuery } from "state/api"; // Update with your actual API query

const TransactionLogs = () => {
  const { data: logs = [], error, isLoading } = useGetTransactionLogsQuery();

  const processedLogs = useMemo(() =>
    logs.map((log) => ({
      ...log,
      date: new Date(log.timestamp).toLocaleDateString(),
      time: new Date(log.timestamp).toLocaleTimeString(),
    })),
    [logs]
  );

  const columns = useMemo(() => [
    {
      accessorKey: "time",
      header: "Time",
      size: 150,
    },
    {
      accessorKey: "date",
      header: "Date",
      size: 150,
    },
    {
      accessorKey: "userEmail",
      header: "User Email",
      size: 200,
    },
    {
      accessorKey: "action",
      header: "Action",
      size: 150,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      size: 100,
    },
    {
      accessorKey: "success",
      header: "Success",
      size: 100,
      Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
    },
  ], []);

  const table = useMaterialReactTable({
    columns,
    data: processedLogs,
    state: {
      isLoading,
    },
    initialState: {
      density: 'compact',
      pagination: { pageIndex: 0, pageSize: 30 },
    },
    enableFullScreenToggle: false,
  });

  if (error) {
    return <div>Error loading transaction logs</div>;
  }

  return (
    <div className="table-container m-5">
      <h3 className="text-left m-4">Transaction Logs</h3>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default TransactionLogs;
