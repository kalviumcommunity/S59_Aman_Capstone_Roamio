"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./page.module.css";
import { TextField, Button } from "@mui/material";

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm();
  const [submitError, setSubmitError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

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
      setCurrentPage(1);
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  const handleNext = async () => {
    let validateFields;
    if (currentPage === 1) {
      validateFields = ["name", "email"];
    } else if (currentPage === 2) {
      validateFields = ["password", "image"];
    }

    const result = await trigger(validateFields);
    if (result) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleBack = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div id={styles.form}>
      {currentPage == 1 && (
        <div id={styles.container} className="flex_row_center">
          <div className={styles.gif}></div>
          <div className="lineVertical"></div>
          <div className={styles.que}>
            <form
              className="flex_column_center"
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextField
                error={!!errors.name}
                helperText={errors.name ? errors.name.message : ""}
                id="name-input"
                label="Name"
                variant="outlined"
                {...register("name", { required: "Name is required" })}
              />
              <TextField
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
                id="email-input"
                label="Email"
                variant="outlined"
                {...register("email", { required: "Email is required" })}
              />
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            </form>
          </div>
        </div>
      )}
      {currentPage == 2 && (
        <div id={styles.container} className="flex_row_center">
          <div className={styles.gif}></div>
          <div className="lineVertical"></div>
          <div className={styles.que}>
            <form
              className="flex_column_center"
              onSubmit={handleSubmit(onSubmit)}
            >
            <TextField
                error={!!errors.image}
                helperText={errors.image ? errors.image.message : ""}
                id="image-input"
                label="Image URL"
                variant="outlined"
                {...register("image")}
              />
              <TextField
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
                id="email-input"
                label="Email"
                variant="outlined"
                {...register("email", { required: "Email is required" })}
              />
              <Button variant="contained" onClick={handleBack}>
                Back
              </Button>
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            </form>
          </div>
        </div>
      )}
      {currentPage == 3 && (
        <div id={styles.container} className="flex_row_center">
          <div className={styles.gif}></div>
          <div className="lineVertical"></div>
          <div className={styles.que}>
            <form
              className="flex_column_center"
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextField
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
                id="password-input"
                label="Password"
                type="password"
                variant="outlined"
                {...register("password", { required: "Password is required" })}
              />
              <Button variant="contained" onClick={handleBack}>
                Back
              </Button>
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            </form>
          </div>
        </div>
      )}
      {currentPage == 4 && (
        <div id={styles.container} className="flex_row_center">
          <div className={styles.gif}></div>
          <div className="lineVertical"></div>
          <div className={styles.que}>
            <form
              className="flex_column_center"
              onSubmit={handleSubmit(onSubmit)}
            >
            <TextField
            error={!!errors.mobileNumber}
            helperText={errors.mobileNumber ? errors.mobileNumber.message : ""}
            id="mobile-number-input"
            label="Mobile Number"
            type="number"
            variant="outlined"
            {...register("mobileNumber", { required: "Mobile number is required" })}
          />
              <Button variant="contained" onClick={handleBack}>
                Back
              </Button>
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
