"use client";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { getAllLogs, getUserDetail } from "../services/api";

interface LogData {
  _id: string;
  oldValue: {
    productName: string;
    price: number;
    description: string;
    offer: string;
  };
  newValue: {
    productName: string;
    price: number;
    description: string;
    offer: string;
  };
  userId: string;
  timestamp: string;
}
interface UserData {
  _id: string;
  email: string;
  createdAt: string;
}
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();

  const [logData, setLogData] = useState([]);
  const [token, setToken] = useState(null);
  const [logDialog, setLogDialog] = useState(false);
  const [userDetailsDialog, setUserDetailsDialog] = useState(false);
  const [viewLog, setViewLog] = useState<LogData | null>(null);
  const [userDetails, setUserDetails] = useState<UserData | null>(null);
  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        const { data }: any = await getAllLogs(token);
        setLogData(data);
      };
      fetchData();
    } else {
      const authDataString = localStorage.getItem("auth");
      const data = authDataString ? JSON.parse(authDataString) : null;
      if (data) {
        setToken(data.access_token);
      } else {
        router.push("/login");
      }
    }
  }, [router, token]);
  const viewLogs = async (data: any) => {
    setLogDialog(true);
    setViewLog(data);
  };
  const getUserDetails = async (user: string) => {
    const fetchData = async () => {
      const { data }: any = await getUserDetail(user, token);
      setUserDetails(data);
    };
    fetchData();
    setUserDetailsDialog(true);
  };
  return (
    <main className="container flex flex-row  bg-slate-600">
      <div className="container  h-screen ">
        <div className="mt-10  p-8">
          <div className="flex flex-row justify-between items-center mb-4 ">
            <h1 className="text-lg font-bold text-white p-2 uppercase">
              Logs will be displayed here
            </h1>
            <div className="flex flex-row items-center gap-2">
              <Button
                onClick={() => {
                  router.push("/product");
                }}
                variant="default"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Manage Products
              </Button>
              <Button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                variant="default"
                className=""
              >
                Logout
              </Button>
            </div>
          </div>
          <div className="table-container border-collapse border-0 border-red-200/20  backdrop-blur-xl">
            <table className="w-full table-fixed">
              <thead>
                <tr>
                  <th className="border text-white border-white/20 w-24 py-2">
                    Created At
                  </th>
                  <th className="border text-white border-white/20 w-24 py-2">
                    Created By
                  </th>
                  <th className="border text-white border-white/20 px-4 w-60 py-2">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {logData?.length > 0 ? (
                  logData.map((data: any, index) => (
                    <tr key={index}>
                      <td className="border justify-center text-white border-white/20 w-3 text-center">
                        <p className="text-xs opacity-80">
                          {new Date(data?.timestamp).toLocaleString()}
                        </p>
                      </td>
                      <td className="border justify-center text-white border-white/20 w-3 text-center">
                        <p className="text-xs opacity-80">{data?.userId}</p>
                      </td>
                      <td className="flex flex-row border-r border-b border-white/20 gap-4 justify-center text-center p-3 items-center">
                        <Button
                          onClick={() => viewLogs(data)}
                          variant="secondary"
                          className="text-xs bg-black/60 text-white"
                          size="sm"
                        >
                          View Logs
                        </Button>
                        <Button
                          onClick={() => getUserDetails(data?.userId)}
                          variant="secondary"
                          className="text-xs"
                          size="sm"
                        >
                          Get User Details
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-white text-center py-4">
                      No Logs In The System
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Dialog open={logDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>The logs are here</DialogTitle>
            <DialogDescription>
              Click on close when you are done
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-black">Old Value</h2>
              <p className="text-xs opacity-80">
                Product Name: {viewLog?.oldValue?.productName}
              </p>
              <p className="text-xs opacity-80">
                Price: {viewLog?.oldValue?.price}
              </p>
              <p className="text-xs opacity-80">
                Description: {viewLog?.oldValue?.description}
              </p>
              <p className="text-xs opacity-80">
                Offer: {viewLog?.oldValue?.offer}
              </p>
            </div>
            <span className="text-2xl text-black mt-4">⇒</span>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-balck">New Value</h2>
              <p className="text-xs opacity-80">
                Product Name: {viewLog?.newValue?.productName}
              </p>
              <p className="text-xs opacity-80">
                Price: {viewLog?.newValue?.price}
              </p>
              <p className="text-xs opacity-80">
                Description: {viewLog?.newValue?.description}
              </p>
              <p className="text-xs opacity-80">
                Offer: {viewLog?.newValue?.offer}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="default"
              onClick={() => setLogDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={userDetailsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>The logs are here</DialogTitle>
            <DialogDescription>
              Click on close when you are done
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-balck mb-10">
                User Information
              </h2>
              <p className="text-lg opacity-80">
                User Email:
                <span className="font-bold ml-2">{userDetails?.email}</span>
              </p>
              <p className="text-lg opacity-80">
                User ID:
                <span className="font-bold ml-2">{userDetails?._id}</span>
              </p>
              <p className="text-lg opacity-80">
                Registered At:
                <span className="font-bold ml-2">
                  {userDetails?.createdAt
                    ? new Date(userDetails.createdAt).toLocaleString()
                    : ""}
                </span>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="default"
              onClick={() => setUserDetailsDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
