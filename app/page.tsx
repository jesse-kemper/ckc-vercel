"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "./components/LoginForm";
export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      // Redirect to /admin/locations if the user is logged in
      router.push("/admin/locations");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <main className="primary">
      <div className="container">
        <aside className="sidebar">
          <img
            className="logo"
            src="https://bestfriendspetcare.com/wp-content/uploads/2024/04/BF_Centered_Logo_HighRes_PetCare.png"
            alt="Best Friends Pet Care"
          />
          <h3>Please login</h3>
        </aside>

        <section className="content">
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Pet Hotel Log System
            </h1>
            <p className="text-gray-600 mb-4">
              Please sign in to access the pet hotel log system.
            </p>
            {/* Include the login form */}
            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
