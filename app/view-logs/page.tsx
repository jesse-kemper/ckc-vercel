"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ViewLogs() {
  const { data: session } = useSession();
  const [petLogs, setPetLogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      fetchPetLogs();
    }
  }, [session]);

  const fetchPetLogs = async () => {
    try {
      const response = await fetch(
        `/api/petlog?locationId=${session.user.locationId}`
      );
      if (response.ok) {
        const data = await response.json();
        setPetLogs(data);
      } else {
        console.error("Failed to fetch pet logs");
      }
    } catch (error) {
      console.error("Error fetching pet logs:", error);
    }
  };

  return (
    <main className="primary">
      <div className="container">
        <aside className="sidebar">
          <img
            className="logo"
            src="https://bestfriendspetcare.com/wp-content/uploads/2024/04/BF_Centered_Logo_HighRes_PetCare.png"
            alt="Best Friends Pet Care"
          />

          <p>Logged in as {session?.user.email}</p>
          {session?.user.locationName && (
            <p>Location: {session.user.locationName}</p>
          )}
          <hr />
          <nav className="primaryNav">
            <button onClick={() => router.push("/")}>New Log</button>
            <button onClick={() => router.push("/view-logs")}>View Logs</button>
          </nav>
        </aside>

        <section className="content">
          <h1>Pet Logs</h1>
          {petLogs.length > 0 ? (
            <ul class="log-list">
              {petLogs.map((log) => (
                <li key={log.id}>
                  <strong>
                    Petname: {log.petName} (room # {log.roomNumber})
                  </strong>{" "}
                  checked at {log.date}
                </li>
              ))}
            </ul>
          ) : (
            <p>No logs found for your location.</p>
          )}
        </section>
      </div>
    </main>
  );
}
