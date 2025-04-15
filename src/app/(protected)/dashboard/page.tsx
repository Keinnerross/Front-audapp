import UserCard from "@/components/audapp/userCard";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Perfil Audapp",
  description:
    "Profile Audapp",
};

export default function Dashboard() {

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 mt-6 md:mt-4">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6  ">
          <UserCard />
        </div>
      </div>
    </div>
  );
}





