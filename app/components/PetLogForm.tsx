"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

interface FormData {
  petName: string;
  roomNumber: string;
  date: string;
  elimination: string;
  consumption: string;
  medication: string;
  gcu: string;
  tmInitials: string;
  smellDirty: string;
  pawsSoiled: string;
  bodySoiled: string;
  oilyDirty: string;
  petType: string;
  runnerInitials: string;
}

export default function PetLogForm() {
  const { data: sessionData } = useSession();
  const session = sessionData as ExtendedSession;

  const [formData, setFormData] = useState<FormData>({
    petName: "",
    roomNumber: "",
    date: "",
    elimination: "",
    consumption: "",
    medication: "",
    gcu: "",
    tmInitials: "",
    smellDirty: "",
    pawsSoiled: "",
    bodySoiled: "",
    oilyDirty: "",
    petType: "",
    runnerInitials: "dis",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      alert("You must be logged in to submit a pet log.");
      return;
    }

    const formattedDate = formData.date
      ? `${formData.date}T00:00:00.000Z`
      : null;

    try {
      const response = await fetch("/api/petlog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          date: formattedDate,
          userId: session.user.id,
        }),
      });

      if (response.ok) {
        alert("Pet log saved successfully!");
        setFormData({
          petName: "",
          roomNumber: "",
          date: "",
          elimination: "",
          consumption: "",
          medication: "",
          gcu: "",
          tmInitials: "",
          runnerInitials: "dis",
          smellDirty: "",
          pawsSoiled: "",
          bodySoiled: "",
          oilyDirty: "",
          petType: "",
        });
      } else {
        const errorData = await response.json();
        alert(`Failed to save pet log: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error saving pet log:", error);
      alert("An error occurred while saving the pet log.");
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-start mb-8">
        <h1>Pet Hotel Log</h1>
      </div>
      <p>
        KEY: S-Stool U-Urine D-Diarrhea V-Vomit B-Blood FL-Food Left SFL-Some
        Food Left X-Ate All
      </p>

      <form onSubmit={handleSubmit}>
        {[
          { label: "Pet's Name:", name: "petName" },
          { label: "Room #:", name: "roomNumber" },
          { label: "Date:", name: "date", type: "date" },
          { label: "Elimination:", name: "elimination" },
          { label: "Consumption:", name: "consumption" },
          { label: "Medication:", name: "medication" },
          { label: "GCU:", name: "gcu" },
          { label: "TM's Initials:", name: "tmInitials" },
        ].map((field) => (
          <div key={field.name}>
            <label>{field.label}</label>
            <input
              type={field.type || "text"}
              value={formData[field.name as keyof FormData]} // Type assertion here
              onChange={
                (e) =>
                  setFormData({
                    ...formData,
                    [field.name]: e.target.value,
                  } as FormData) // Type assertion here
              }
            />
          </div>
        ))}

        <h2>Nose to Tail Check</h2>

        {[
          { label: "Does the pet smell dirty?", name: "smellDirty" },
          { label: "Are the paws/legs soiled or wet?", name: "pawsSoiled" },
          {
            label: "Is the pet soiled on sanitary areas or body?",
            name: "bodySoiled",
          },
          {
            label: "Does the pet feel oily or dirty to the touch?",
            name: "oilyDirty",
          },
        ].map((field) => (
          <div key={field.name} className="radio-group">
            <label className="radio-label">{field.label}</label>
            <div className="radio-options">
              <input
                type="radio"
                name={field.name}
                value="Yes"
                checked={formData[field.name as keyof FormData] === "Yes"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [field.name]: e.target.value,
                  } as FormData)
                }
              />
              <label>Yes</label>
              <input
                type="radio"
                name={field.name}
                value="No"
                checked={formData[field.name as keyof FormData] === "No"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [field.name]: e.target.value,
                  } as FormData)
                }
              />
              <label>No</label>
            </div>
          </div>
        ))}

        <div className="radio-group">
          <label className="radio-label">
            Is the pet a puppy or senior pet?
          </label>
          <div className="radio-options">
            <input
              type="checkbox"
              name="petType"
              value="Puppy"
              checked={formData.petType === "Puppy"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  petType: e.target.checked ? "Puppy" : "",
                })
              }
            />
            <label>Puppy</label>
            <input
              type="checkbox"
              name="petType"
              value="Senior"
              checked={formData.petType === "Senior"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  petType: e.target.checked ? "Senior" : "",
                })
              }
            />
            <label>Senior</label>
          </div>
        </div>

        <p className="note">
          If "YES" to any of these questions, please ask a groomer to perform a
          QCU. If a groomer is unavailable, ask a manager for assistance.
        </p>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
