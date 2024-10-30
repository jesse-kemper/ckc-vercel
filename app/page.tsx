"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PetLogForm from "./components/PetLogForm";
import LoginForm from "./components/LoginForm";
import LogoutButton from "./components/LogoutButton";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <main className="primary">
      <div className="container">
        {/* Sidebar section */}
        <aside className="sidebar">
          <img
            className="logo"
            src="https://bestfriendspetcare.com/wp-content/uploads/2024/04/BF_Centered_Logo_HighRes_PetCare.png"
            alt="Best Friends Pet Care"
          />

          {session ? (
            <div className="loggedInMessage">
              <p>Logged in as {session.user.email}</p>
              {session.user.locationName && (
                <p>Location: {session.user.locationName}</p>
              )}
              <LogoutButton />
              <hr />
              <nav className="primaryNav">
                <button onClick={() => router.push("/")}>New Log</button>
                <button onClick={() => router.push("/view-logs")}>
                  View Logs
                </button>
              </nav>
            </div>
          ) : (
            <h3>Please login</h3>
          )}
        </aside>

        {/* Content section */}
        <section className="content">
          {session ? (
            <div className="space-y-4 text-center">
              <PetLogForm />
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <h1 className="text-2xl font-bold text-gray-800">
                Pet Hotel Log System
              </h1>
              <p className="text-gray-600 mb-4">
                Please sign in to access the pet hotel log system.
              </p>
              <LoginForm />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
