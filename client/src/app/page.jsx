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
import Image from "next/image";
import { redirect } from "next/navigation";

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
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const error = { message: submitError };
  const loginValidate = async ({ email, password }) => {
    try {
      const response = await fetch("http://localhost:8081/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSubmitError(errorData.message);
        console.log(errorData.message);
      }
      {
        response.ok && console.log("login successfull!");
      }
    } catch (error) {
      console.error("Error occurred while logging in:", error.message);
    }
  };

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
      console.log(error.message);
    }
  };

  const handleNext = async () => {
    let validateFields;
    if (currentPage === 1) {
      validateFields = ["email"];
    } else if (currentPage === 2) {
      validateFields = ["name", "dob", "gender"];
    } else if (currentPage === 3) {
      validateFields = ["password"];
    } else if (currentPage === 4) {
      validateFields = ["mobileNumber"];
    }
    const result = await trigger(validateFields);
    if (result && currentPage != 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleBack = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const checkUserExistence = async (data) => {
    try {
      const response = await fetch(
        `http://localhost:8081/users/userExist?email=${encodeURIComponent(
          data.email
        )}`
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.message);
      }

      const responseData = await response.json();
      if (!responseData.userFound) {
        handleNext();
        setCurrentPage(2);
      }
      if (responseData.userFound) {
        handleNext();
        setCurrentPage(5);
      }
    } catch (error) {
      setSubmitError(error.message);
      console.error(error.message);
    }
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
                <p className={`${ArbutusSlab.className} ${styles.brief}`}>
                  We're so happy you're here! Let's start this journey together.
                  Get ready for fun, connections, and new adventures!
                </p>

                <TextField
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ""}
                  id="email-input"
                  label="Email"
                  variant="outlined"
                  {...register("email", { required: "Email is required" })}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {submitError && <p style={{ color: "red" }}>{submitError}</p>}
                <div className={styles.buttonBox}>
                  <div
                    className={`${ArbutusSlab.className} flex_row_center `}
                    id={styles.googleAuth}
                  >
                    <p>
                      <u>or sign up with &nbsp;</u>
                    </p>
                    <Image
                      src="/google.png"
                      width={70}
                      height={25}
                      alt="google"
                    />
                  </div>
                  <Button
                    variant="contained"
                    onClick={() => {
                      checkUserExistence({ email });
                    }}
                  >
                    Get Started
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
        {currentPage == 2 && (
          <div id={styles.container} className="flex_row_center">
            <div className={`${styles.gif} flex_column_center`}>
              <p className={`${ArbutusSlab.className} ${styles.brief}`}>
                Choose a profile pic😉
              </p>
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
                <TextField
                  error={!!errors.name}
                  helperText={errors.name ? errors.name.message : ""}
                  id="name-input"
                  label="Name"
                  variant="outlined"
                  {...register("name", { required: "Name is required" })}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDatePicker
                    label="Select Your Birthdate"
                    id="dob"
                    defaultValue={dayjs("2005-02-25")}
                    {...register("dob", {
                      required: "Date of birth is required",
                    })}
                  />
                </LocalizationProvider>
                <p className={`${ArbutusSlab.className} ${styles.brief}`}>
                  Select your gender:
                </p>
                <GenderInput register={register} error={errors.gender} />

                <div className={styles.buttonBox}>
                  <Button variant="contained" onClick={handleBack}>
                    Back
                  </Button>
                  <Button variant="contained" onClick={handleNext}>
                    Next
                  </Button>
                </div>
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
                <p className={`${ArbutusSlab.className} ${styles.brief}`}>
                  Create a strong password 😉
                </p>
                <PasswordInput
                  name="password"
                  register={register}
                  error={errors.password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className={styles.buttonBox}>
                  <Button variant="contained" onClick={handleBack}>
                    Back
                  </Button>
                  <Button variant="contained" onClick={handleNext}>
                    Next
                  </Button>
                </div>
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
                <p className={`${ArbutusSlab.className} ${styles.brief}`}>
                  Enter your mobile number :
                </p>
                <div>
                  <TextField
                    error={!!errors.mobileNumber}
                    helperText={
                      errors.mobileNumber ? errors.mobileNumber.message : ""
                    }
                    label="Mobile Number"
                    type="number"
                    variant="outlined"
                    {...register("mobileNumber", {
                      required: "Mobile number is required",
                    })}
                  />
                </div>
                {submitError && <p style={{ color: "red" }}>{submitError}</p>}
                <div className={styles.buttonBox}>
                  <Button variant="contained" onClick={handleBack}>
                    Back
                  </Button>
                  <Button type="submit" variant="contained">
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
        {currentPage == 5 && (
          <div id={styles.container} className="flex_row_center">
            <div className={styles.gif}></div>
            <div className="lineVertical"></div>
            <div className={styles.que}>
              <form
                className="flex_column_center"
                onSubmit={handleSubmit(onSubmit)}
              >
                <p className={`${ArbutusSlab.className} ${styles.brief}`}>
                  Welcome back ! please enter your password to login
                </p>
                <PasswordInput
                  name="password"
                  register={register}
                  error={error}
                  setPassword={setPassword}
                />
                {submitError && <p style={{ color: "red" }}>{submitError}</p>}

                <div className={styles.buttonBox}>
                  <Button variant="contained" onClick={() => setCurrentPage(1)}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      loginValidate({ email, password });
                    }}
                  >
                    Login
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}
