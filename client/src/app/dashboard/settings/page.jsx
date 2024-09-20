'use client';

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "@/features/userSlice";
import getCookieValue from "@/utils/getCookieValue";

function UserProfileForm() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const [currentPage, setCurrentPage] = useState("my profile");
  const [userData, setUserData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      console.log(state.user.userData);
      try {
        if (state) {
          setUserData(state.user);
          // Set form fields with fetched data
          setValue("username", state.user.userData.username);
          setValue("dob", state.user.userData.dob);
          setValue("gender", state.user.userData.gender);
          setValue("mobileNumber", state.user.userData.mobileNumber);
          setValue("bloodGroup", state.user.userData.bloodGroup);
          setValue("about", state.user.userData.about);
          setValue("email", state.user.userData.email);
          setValue("publicAccount", state.user.userData.publicAccount);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [state.user, setValue]);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.patch(
        "http://localhost:8081/users/updateUser",
        data,
        {
          headers: {
            Authorization: `Bearer ${getCookieValue("accessToken")}`,
          },
        }
      );
      console.log("User updated successfully:", response.data);
      // Optionally handle success message or redirect
    } catch (error) {
      console.error("Error updating user:", error);
      // Optionally handle error message
    }
  };

  const handleLogout = () => {
    document.cookie = `accessToken=`;
    document.cookie = `refreshToken=`;
    dispatch(signOut());
    alert("User logged out");
  };

  const handleDeleteAccount = async () => {
    try {
      // Send delete request to backend
      await axios.delete("http://localhost:8081/users/deleteUser", {
        headers: {
          Authorization: `Bearer ${getCookieValue("accessToken")}`,
        },
      });
      // Clear cookies on successful deletion
      document.cookie = `accessToken=`;
      document.cookie = `refreshToken=`;
      alert("Account deleted successfully");
      // Optionally redirect or handle further actions
    } catch (error) {
      console.error("Error deleting account:", error);
      // Optionally handle error message
    }
  };

  return (
    <div className="w-[70vw] h-[80vh] absolute top-[55vh] left-2/4 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg border-3 border-green-800 flex overflow-hidden">
      <div className="w-1/4 bg-white flex flex-col border-r border-green-800">
        <span
          className={`p-4 cursor-pointer ${
            currentPage === "my profile" ? "bg-gray-200" : ""
          }`}
          onClick={() => handleChangePage("my profile")}
        >
          My Profile
        </span>
        <span
          className={`p-4 cursor-pointer ${
            currentPage === "account settings" ? "bg-gray-200" : ""
          }`}
          onClick={() => handleChangePage("account settings")}
        >
          Account Settings
        </span>
        <span
          className="p-4 cursor-pointer"
          onClick={() => setOpenDialog(true)}
        >
          Delete Account
        </span>
        <span className="p-4 cursor-pointer" onClick={handleLogout}>
          Logout
        </span>
      </div>
      <div className="w-3/4 bg-white overflow-y-auto p-4">
        {currentPage === "my profile" && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-16">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Profile
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  This information will be displayed publicly so be careful what you share.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  {/* Profile Form Fields */}
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Username
                    </label>
                    <div className="mt-2">
                      <input
                        id="username"
                        {...register("username")}
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  
                  {/* Additional Profile Form Fields */}
                  {/* ... Add other fields as needed ... */}
                </div>
              </div>

              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Personal Information
                </h2>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  {/* Personal Information Form Fields */}
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        {...register("email")}
                        type="email"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  {/* Additional Personal Information Form Fields */}
                  {/* ... Add other fields as needed ... */}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        )}

        {currentPage === "account settings" && (
          <div className="flex flex-col items-center">
            <button
              className="mb-4 w-48 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => setOpenDialog(true)}
            >
              Delete Account
            </button>
            <button
              className="w-48 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogBackdrop className="fixed inset-0 bg-black opacity-25" />
        <DialogPanel className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <DialogTitle className="text-lg font-bold mb-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500 inline-block" />{" "}
              Delete Account
            </DialogTitle>
            <p className="mb-4">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex justify-end">
              <button
                className="mr-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleDeleteAccount}
              >
                Delete
              </button>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
  );
}

export default UserProfileForm;
