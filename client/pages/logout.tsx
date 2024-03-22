import React, { useEffect } from "react";
import { useRouter } from "next/router";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("store");
    sessionStorage.removeItem("products");
    sessionStorage.removeItem("tracks");
    sessionStorage.removeItem("followers");
    sessionStorage.removeItem("following");

    console.log("logging out")
    router.push("/");
  }, [router]);

  return <div>Logging out...</div>;
}