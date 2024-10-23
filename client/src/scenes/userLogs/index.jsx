import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useGetUserActivityLogsQuery } from "state/api";

const UserLogs = () => {
  const { data: logs = [], error, isLoading } = useGetUserActivityLogsQuery();

  const processedLogs = useMemo(() => logs.map((log) => {
    const dateObj = new Date(log.timestamp);
    return {
      ...log,
      date: dateObj.toLocaleDateString(),
      time: dateObj.toLocaleTimeString(),
    };
  }), [logs]);

  const columns = useMemo(
    () => [
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
        accessorKey: "success",
        header: "Success",
        size: 100,
        Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
      },
    ],
    []
  );

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
    return <div>Error loading user activity logs</div>;
  }

  return (
    <div className="table-container m-5">
      <h3 className="text-left m-4">User Logs</h3>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default UserLogs;
