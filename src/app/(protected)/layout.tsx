"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React, { useEffect } from "react";
import { redirect } from 'next/navigation';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  // const mainContentMargin = isMobileOpen
  //   ? "ml-0"
  //   : isExpanded || isHovered
  //     ? "lg:ml-[290px]"
  //     : "lg:ml-[90px]";


  useEffect(() => {

    const session = localStorage.getItem("jwt");
    if (!session) {
      redirect('/signin');
    }
  }, [])
  
  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      {/* <AppSidebar /> */}
      {/* <Backdrop /> */}
      {/* Main Content Area */}
      <div
      // ${mainContentMargin} esta clase sele agrega para el correcto estilo de la sidebar.
        className={`flex-1 transition-all  duration-300 ease-in-out `}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
        {children}</div>
      </div>
    </div>
  );
}
