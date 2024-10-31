"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ViewLogs() {
  const { data: session } = useSession() as {
    data: {
      user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        locationName?: string | null;
        locationId?: string | null;
      };
    };
  };
  interface PetLog {
    id: string;
    petName: string;
    roomNumber: string;
    elimination: string;
    consumption: string;
    medication: string;
    gcu: string;
    smellDirty: string;
    pawsSoiled: string;
    bodySoiled: string;
    oilyDirty: string;
    petType: string;
    date: string;
    tmInitials: string;
    createdAt: string;
  }

  const [petLogs, setPetLogs] = useState<PetLog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Set a default page size
  const [totalLogs, setTotalLogs] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      fetchPetLogs(currentPage);
    }
  }, [session, currentPage]);

  const fetchPetLogs = async (page: number) => {
    try {
      const response = await fetch(
        `/api/petlog?locationId=${session.user.locationId}&page=${page}&pageSize=${pageSize}`
      );
      if (response.ok) {
        const data = await response.json();
        setPetLogs(data.logs);
        setTotalLogs(data.totalLogs);
      } else {
        console.error("Failed to fetch pet logs");
      }
    } catch (error) {
      console.error("Error fetching pet logs:", error);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Pet Name",
      "Room Number",
      "Elimination",
      "Consumption",
      "Medication",
      "GCU",
      "Smell Dirty",
      "Paws Soiled",
      "Body Soiled",
      "Oily Dirty",
      "Pet Type",
      "Date",
      "TM Initials",
    ];
    const rows = petLogs.map((log) => [
      log.petName,
      log.roomNumber,
      log.elimination,
      log.consumption,
      log.medication,
      log.gcu,
      log.smellDirty,
      log.pawsSoiled,
      log.bodySoiled,
      log.oilyDirty,
      log.petType,
      log.date,
      log.tmInitials,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pet_logs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(totalLogs / pageSize);

  return (
    <main className="primary">
      <div className="container">
        <aside className="sidebar">
          <img
            className="logo"
            src="https://bestfriendspetcare.com/wp-content/uploads/2024/04/BF_Centered_Logo_HighRes_PetCare.png"
            alt="Best Friends Pet Care"
          />

          {session?.user && <p>Logged in as {session.user.email}</p>}
          {session?.user && session.user.locationName && (
            <p>Location: {session.user.locationName}</p>
          )}
          <hr />
          <nav className="primaryNav">
            <button onClick={() => router.push("/")}>New Log</button>
            <button onClick={() => router.push("/view-logs")}>View Logs</button>
            <button onClick={exportToCSV}>Export to CSV</button>
          </nav>
        </aside>

        <section className="content">
          <h1>Pet Logs</h1>
          {petLogs.length > 0 ? (
            <>
              <ul className="log-list">
                {petLogs.map((log) => (
                  <li key={log.id}>
                    <strong>
                      Petname: {log.petName} (room # {log.roomNumber})
                    </strong>{" "}
                    checked at {log.createdAt} by {log.tmInitials}
                  </li>
                ))}
              </ul>
              {/* Pagination controls */}
              <div className="pagination">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p>No logs found for your location.</p>
          )}
        </section>
      </div>
    </main>
  );
}
