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
import { useRouter } from "next/navigation";
import { firebaseAuth, googleAuthProvider } from "./auth/firebase/firebaseApp";
import { signInWithPopup } from "firebase/auth";
import FileUploader from "./components/UploadFile/UploadFile";
import axios from "axios";
import setTokenCookies from "@/utils/setTokenCookies";

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
    setValue,
  } = useForm();
  const [submitError, setSubmitError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const loginValidate = async ({ email, password }) => {
    try {
      const response = await axios.post("http://localhost:8081/users/login", {
        email,
        password,
      });

      if (response.status !== 200) {
        const errorData = response.data;
        setSubmitError(errorData.message);
        return false;
      } else {
        const responseData = response.data;
        setTokenCookies(
          responseData.data.accessToken,
          responseData.data.refreshToken
        );
        return true;
      }
    } catch (error) {
      console.error("Error occurred while logging in:", error.message);
      throw error;
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(firebaseAuth, googleAuthProvider);
      const user = result.user;

      const userData = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
        emailVerified: user.emailVerified,
        metadata: user.metadata,
        phoneNumber: user.phoneNumber,
      };

      console.log(userData);

      const response = await axios.post(
        "http://localhost:8081/users/googleAuthentication",
        userData
      );

      if (response.status === 200) {
        const responseData = response.data;
        setTokenCookies(
          responseData.data.accessToken,
          responseData.data.refreshToken
        );
        router.push("/dashboard/upload");
      } else {
        console.error("Login failed:", response.data);
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  const handleLoginClick = async ({ email, password }) => {
    try {
      const loginSuccess = await loginValidate({ email, password });
      if (loginSuccess) {
        router.push("/dashboard/upload");
      }
      console.log(loginSuccess);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (formData) => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("username", formData.username);
    data.append("dob", formData.dob);
    data.append("gender", formData.gender);
    data.append("password", formData.password);
    data.append("mobileNumber", formData.mobileNumber);
    formData.files.forEach((file) => {
      data.append("files", file);
    });
    try {
      const response = await axios.post(
        "http://localhost:8081/users/add-user",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status !== 200) {
        const errorData = response.data;
        setSubmitError(errorData.message);
        return false;
      } else {
        const responseData = response.data;
        setTokenCookies(
          responseData.data.accessToken,
          responseData.data.refreshToken
        );
        router.push("/dashboard/upload");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleNext = async () => {
    const validateFields = getCurrentPageFields(currentPage);
    const result = await trigger(validateFields);
    if (result && currentPage !== 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleBack = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const checkUserExistence = async (data) => {
    try {
      const response = await fetch(
        `http://localhost:8081/users/doesUserExist?email=${encodeURIComponent(
          data.email
        )}`
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.message);
      }

      const responseData = await response.json();
      console.log(responseData.data);
      if (responseData.data.isGoogleSignedUp) {
        setSubmitError(
          "This mail is already signed up using google auth provider."
        );
      } else if (!responseData.data.userFound) {
        handleNext();
        setCurrentPage(2);
      } else {
        handleNext();
        setCurrentPage(5);
      }
    } catch (error) {
      setSubmitError(error.message);
      console.error(error.message);
    }
  };

  const getCurrentPageFields = (page) => {
    switch (page) {
      case 1:
        return ["email"];
      case 2:
        return ["name", "dob", "gender", "files"];
      case 3:
        return ["password"];
      case 4:
        return ["mobileNumber"];
      default:
        return [];
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div id={styles.form}>
        {currentPage === 1 && (
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
                    onClick={handleGoogleLogin}
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
        {currentPage === 2 && (
          <div id={styles.container} className="flex_row_center">
            <div className="flex flex-col justify-evenly items-center h-full py-28">
              <p className={`${ArbutusSlab.className}`}>
                Upload your profile image
              </p>
              <FileUploader register={register} setValue={setValue} />
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
        {currentPage === 3 && (
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
        {currentPage === 4 && (
          <div id={styles.container} className="flex_row_center">
            <div className={styles.gif}></div>
            <div className="lineVertical"></div>
            <div className={styles.que}>
              <form
                className="flex_column_center"
                onSubmit={handleSubmit(onSubmit)}
              >
                <p className={`${ArbutusSlab.className} ${styles.brief}`}>
                  Enter your mobile number:
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
        {currentPage === 5 && (
          <div id={styles.container} className="flex_row_center">
            <div className={styles.gif}></div>
            <div className="lineVertical"></div>
            <div className={styles.que}>
              <form
                className="flex_column_center"
                onSubmit={handleSubmit(onSubmit)}
              >
                <p className={`${ArbutusSlab.className} ${styles.brief}`}>
                  Welcome back! Please enter your password to login
                </p>
                <PasswordInput
                  name="password"
                  register={register}
                  error={errors.password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {submitError && <p style={{ color: "red" }}>{submitError}</p>}

                <div className={styles.buttonBox}>
                  <Button variant="contained" onClick={() => setCurrentPage(1)}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleLoginClick({ email, password })}
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
