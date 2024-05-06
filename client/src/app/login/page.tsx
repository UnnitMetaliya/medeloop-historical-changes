"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { FaDiscord } from "react-icons/fa";
import { redirect, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation"; // Import useRouter
import { login } from "../../services/api";

function Login() {
  const router = useRouter(); // Use the useRouter hook to get the router object

  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [userLoginResponse, setUserLoginResponse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const authDataString = localStorage.getItem("auth");
      const data = authDataString ? JSON.parse(authDataString) : null;
      if (data) {
        router.push("/");
      }
    };

    fetchData();
  }, [searchParams]);

  const handleSignIn = async () => {
    if (!email) {
      toast({
        title: "Uh oh! 😕",
        description: "Please enter both email and password.",
      });
      return;
    }
    if (!email) {
      toast({
        title: "Oops! 😟",
        description: "Please enter your email.",
      });
      return;
    }
    const { data } = await login(email);
    console.log(data);
    localStorage.setItem("auth", JSON.stringify(data));
    window.location.reload();
  };

  return (
    <div>
      <div className="container mt-36  flex item-center justify-center select-none  p-4">
        <div className="main-content  flex flex-col items-center space-y-4 border border-black rounded-xl p-10">
          <Label
            className="pb-4 md:text-3xl font-bold tracking-wide"
            htmlFor=""
          >
            Please Sign In to see the logs 👋🏼
          </Label>
          <Label>Please enter any email to continue</Label>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            className="md:w-64 md:h-10 border-black"
            type="email"
            placeholder="Email"
          />
          <Button
            onClick={handleSignIn}
            className="md:w-64 md:h-10 w-64 font-bold"
            color="gray"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
