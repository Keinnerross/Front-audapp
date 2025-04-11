import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import { Metadata } from "next";
import React from "react";
import FormAcreditacionCompetencias from "./form";
export const metadata: Metadata = {
  title: "Acreditación de competencias",
};


export default function AcreditacionCompetencias() {


  return (

    <div className="w-full flex flex-col items-center">
      <div className="max-w-[1240px] w-full">
        <PageBreadcrumb pageTitle="Acreditación de competencias" />
        <FormAcreditacionCompetencias />
      </div>

    </div>


  );
}

