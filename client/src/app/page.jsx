"use client";

import dayjs from "dayjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./page.module.css";
import { TextField, Button } from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PasswordInput from "./components/Password";
import GenderInput from "./components/GenderInput/GenderInput";
import ArbutusSlab from "../../public/fonts/Arbutus_Slab";

const theme = createTheme({
  palette: {
    primary: {
      main: "#17620be8",
    },
    secondary: {
      main: "#17620be8",
      light: "#17620be8",
    },
  },
});

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
      console.log(data)
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
      console.log(error.message);
    }
  };

  const handleNext = async () => {
    let validateFields;
    if (currentPage === 1) {
      validateFields = ["name", "email"];
    } else if (currentPage === 2) {
      validateFields = ["password"];
    } else if (currentPage === 3) {
      validateFields = ["dob" , "gender"];
    } else if (currentPage === 4) {
      validateFields = ["mobileNumber"];
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
    <ThemeProvider theme={theme}>
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
              <p className={ArbutusSlab.className}>We're so happy you're here! Let's start this journey together. Get ready for fun, connections, and new adventures!</p>
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
              <PasswordInput
                  name="password"
                  register={register}
                  error={errors.password}
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
          <div className={`${styles.gif} flex_column_center`}>
              <TextField
                error={!!errors.image}
                helperText={errors.image ? errors.image.message : ""}
                id="image-input"
                label="Image URL"
                variant="outlined"
                {...register("image")}
              />
            </div>
            <div className="lineVertical"></div>
            <div className={styles.que}>
              <form
                className="flex_column_center"
                onSubmit={handleSubmit(onSubmit)}
              >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                label="Select Your Birthdate"
                id='dob'
                defaultValue={dayjs("2005-02-25")}
                {...register("dob", { required: "Date of birth is required" })}
              />
            </LocalizationProvider>
            <GenderInput register={register} error={errors.gender} />
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
                <div>
                  <TextField
                    error={!!errors.mobileNumber}
                    helperText={
                      errors.mobileNumber ? errors.mobileNumber.message : ""
                    }
                    id="mobile-number-input"
                    label="Mobile Number"
                    type="number"
                    variant="outlined"
                    {...register("mobileNumber", {
                      required: "Mobile number is required",
                    })}
                  />
                </div>
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
    </ThemeProvider>
  );
}
