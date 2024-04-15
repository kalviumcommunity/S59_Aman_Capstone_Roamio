"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

export default function Home() {
  const { register, handleSubmit, errors } = useForm();
  const [submitError, setSubmitError] = useState(null);

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:8081/users/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to add User");
      }
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" name="name" placeholder="Name" {...register("name")} />
      <input type="text" name="email" placeholder="Email" {...register("email")} />
      <input type="password" name="password" placeholder="Password" {...register("password")} />
      <input type="text" name="image" placeholder="Image" {...register("image")} />
      <input type="number" name="mobileNumber" placeholder="Mobile Number" {...register("mobileNumber")} />
      <button type="submit" >Submit</button>
      {submitError && <p>{submitError}</p>}
    </form>
  );
};
