"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import getCookieValue from "@/utils/getCookieValue";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const accessToken = getCookieValue("accessToken");
        const refreshToken = getCookieValue("refreshToken");

        try {
          const response = await axios.post(
            "http://localhost:8081/users/googleAuthentication",
            {
              accessToken,
              refreshToken,
            },
            {
              withCredentials: true, // Include cookies in the request
            }
          );

          const { isAuthenticated } = response.data;

          if (!isAuthenticated) {
            router.replace("/");
          }
        } catch (error) {
          router.replace("/");
        }
      };

      checkAuth();
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
