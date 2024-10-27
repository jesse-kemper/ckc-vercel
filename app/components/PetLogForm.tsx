"use client";

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'


export default function PetLogForm() {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    petName: '',
    roomNumber: '',
    date: '',
    elimination: '',
    consumption: '',
    medication: '',
    gcu: '',
    tmInitials: '',
    smellDirty: '',
    pawsSoiled: '',
    bodySoiled: '',
    oilyDirty: '',
    petType: '',
  })

  return (
    <div className="container">
      <div className="flex justify-between items-start mb-8">
        <Image 
          src="/logo.png" 
          alt="Best Friends Pet Care" 
          width={120} 
          height={50}
        />
        <h1>Pet Hotel Log</h1>
      </div>

      <p>KEY: S-Stool U-Urine D-Diarrhea V-Vomit B-Blood FL-Food Left SFL-Some Food Left X-Ate All</p>

      <form>
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
              value={formData[field.name]}
              onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
            />
          </div>
        ))}

        <h2>Nose to Tail Check</h2>

        {[
          { label: "Does the pet smell dirty?", name: "smellDirty" },
          { label: "Are the paws/legs soiled or wet?", name: "pawsSoiled" },
          { label: "Is the pet soiled on sanitary areas or body?", name: "bodySoiled" },
          { label: "Does the pet feel oily or dirty to the touch?", name: "oilyDirty" },
        ].map((field) => (
          <div key={field.name} className="radio-group">
            <label>{field.label}</label>
            <input
              type="radio"
              name={field.name}
              value="Yes"
              onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
            />
            <label>Yes</label>
            <input
              type="radio"
              name={field.name}
              value="No"
              onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
            />
            <label>No</label>
          </div>
        ))}

        <div className="radio-group">
          <label>Is the pet a puppy or senior pet?</label>
          <input
            type="checkbox"
            name="petType"
            value="Puppy"
            onChange={(e) => setFormData({...formData, petType: e.target.checked ? 'Puppy' : ''})}
          />
          <label>Puppy</label>
          <input
            type="checkbox"
            name="petType"
            value="Senior"
            onChange={(e) => setFormData({...formData, petType: e.target.checked ? 'Senior' : ''})}
          />
          <label>Senior</label>
        </div>

        <p className="note">
          If "YES" to any of these questions, please ask a groomer to perform a QCU. 
          If a groomer is unavailable, ask a manager for assistance.
        </p>

        <button type="submit">Submit</button>
      </form>
    </div>
  )
}