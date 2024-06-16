"use client"

import React, { useState } from "react";
import TextField from "@mui/material/TextField";

function Page() {
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isRoamioTrip, setIsRoamioTrip] = useState(false);

  return (
    <div>
      <form>
        <TextField
          id="email-input"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="location-input"
          label="Location"
          variant="outlined"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <TextField
          id="description-input"
          label="Short Description"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          id="roamio-trip-input"
          label="Is trip conducted on Roamio?"
          variant="outlined"
          type="checkbox"
          checked={isRoamioTrip}
          onChange={(e) => setIsRoamioTrip(e.target.checked)}
        />
      </form>
    </div>
  );
}

export default Page;
