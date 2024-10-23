import React, { useMemo, useEffect } from "react";
import Navbar from "componenets/navbar"; 
import useAuth from "hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useGetDonationHistoryQuery } from "state/api";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const ViewHistory = () => {
  const authData = useAuth();
  const navigate = useNavigate();

  const { data: donationHistory = [], error, isLoading } = useGetDonationHistoryQuery(
    authData.userId,
    { skip: !authData.userId } // skip query if userId is not available
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "_Id",
        size: 150,
        hidden: true, // Hide the ID column
      },
      {
        accessorKey: "title",
        header: "Title",
        size: 150,
      },
      {
        accessorKey: "comment",
        header: "Comment",
        size: 200,
      },
      {
        accessorKey: "amount",
        header: "Donated",
        size: 75,
      },
      {
        accessorKey: "date",
        header: "Date",
        size: 100,
      },
      {
        accessorKey: "time",
        header: "Time",
        size: 100,
      },
    ],
    []
  );

  const processedHistory = useMemo(
    () =>
      donationHistory.map((donation) => ({
        ...donation,
        date: new Date(donation.timestamp).toLocaleDateString(),
        time: new Date(donation.timestamp).toLocaleTimeString(),
        amount: `RM ${donation.amount}`, // Add "RM " prefix to amount
      })),
    [donationHistory]
  );

  const handleRowClick = (row) => {
    const { id } = row.original;
    navigate(`/donation/${id}`);
  };

  const table = useMaterialReactTable({
    columns,
    data: processedHistory,
    state: {
      isLoading,
    },
    initialState: {
      density: "compact",
      pagination: { pageIndex: 0, pageSize: 30 },
      columnVisibility: { id: false },
    },
    enableFullScreenToggle: false,
    muiTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        handleRowClick(row);
      },
      sx: {
        cursor: 'pointer', //you might want to change the cursor too when adding an onClick
      },
    }),
    /* getRowProps: (row) => ({
      onClick: () => handleRowClick(row),
      style: {
        cursor: "pointer",
        backgroundColor: "#f0f0f0", // Optional: Background color on hover
      },
    }), */
  });

  useEffect(() => {
    if (error) {
      navigate("/error", { state: { error } });
    }
  }, [error]);

  if (!authData.userId) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="table-container m-5">
        <h3 className="text-left m-4">Donation History</h3>
        <MaterialReactTable table={table} />
      </div>
    </div>
  );
};

export default ViewHistory;
