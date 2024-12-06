"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Location {
  id: number;
  centerId: number;
  locationName: string;
  email: string;
  phone: string;
  address: string;
  cityState: string;
  zip: string;
  password: string | null;
}

export default function LocationsAdmin() {
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
  const [locations, setLocations] = useState<Location[]>([]);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const router = useRouter();
  useEffect(() => {
    fetch("/api/admin/locations")
      .then((res) => res.json())
      .then((data: Location[]) => setLocations(data));
  }, []);

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this location?")) {
      await fetch(`/api/admin/locations/${id}`, {
        method: "DELETE",
      });
      setLocations(locations.filter((loc) => loc.id !== id));
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

          {session?.user && (
            <p className="loggedInMessage">Logged in as {session.user.email}</p>
          )}

          <hr />
          <nav className="primaryNav">
            <button onClick={() => router.push("/")}>Log Out</button>
          </nav>
        </aside>

        <section className="content">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Manage Locations</h1>
            <hr></hr>
            <table className="bfTable">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Center ID</th>
                  <th className="border border-gray-300 p-2">Location Name</th>
                  <th className="border border-gray-300 p-2">Email</th>
                  <th className="border border-gray-300 p-2">Phone</th>
                  <th className="border border-gray-300 p-2">Password</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((location) => (
                  <tr key={location.centerId}>
                    <td className="border border-gray-300 p-2">
                      {location.centerId}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {location.locationName}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {location.email}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {location.phone}
                    </td>

                    <td
                      className={`border border-gray-300 p-2 ${
                        location.password ? "bg-green-200" : "bg-red-200"
                      }`}
                    >
                      {location.password ? "Password Set" : "No Password Set"}
                    </td>
                    <td className="border border-gray-300 p-2 actions">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                        onClick={() => handleEdit(location)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                        onClick={() => handleEdit(location)}
                      >
                        View Logs
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleDelete(location.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {editingLocation && (
              <EditLocationModal
                location={editingLocation}
                setEditingLocation={setEditingLocation}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function EditLocationModal({
  location,
  setEditingLocation,
}: {
  location: Location;
  setEditingLocation: (location: Location | null) => void;
}) {
  const [form, setForm] = useState<Location>(location);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/admin/locations/${location.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setEditingLocation(null);
    window.location.reload();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Edit Location</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={form.locationName}
            onChange={(e) => setForm({ ...form, locationName: e.target.value })}
            placeholder="Location Name"
            className="modal-input"
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            className="modal-input"
          />
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Phone"
            className="modal-input"
          />
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Address"
            className="modal-input"
          />
          <input
            type="text"
            value={form.cityState}
            onChange={(e) => setForm({ ...form, cityState: e.target.value })}
            placeholder="City/State"
            className="modal-input"
          />
          <input
            type="text"
            value={form.zip}
            onChange={(e) => setForm({ ...form, zip: e.target.value })}
            placeholder="Zip"
            className="modal-input"
          />
          <input
            type="password"
            placeholder="Password (optional)"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="modal-input"
          />
          <div className="modal-actions">
            <button type="submit" className="modal-button modal-button-save">
              Save
            </button>
            <button
              type="button"
              className="modal-button modal-button-cancel"
              onClick={() => setEditingLocation(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
