"use client";

import { useState } from "react";
import BaseInformeAcreditacionCompetencias from "./steps/base_informe";
import ProcedimientoGeneralAcreditacionCompetencias from "./steps/procedimiento_general";
import HabitosOperacionalesAcreditacionCompetencias from "./steps/habitos_operacionales";
import GestionDeControlAcreditacionCompetencias from "./steps/gestion_de_control";
import HabilitacionlAcreditacionCompetencias from "./steps/habilitacion";
import AcreditacionCompetenciasAcreditacionCompetencias from "./steps/acreditacion_competencias";
import Button from "@/components/ui/button/Button";


/// Importing components for each step of the form
const steps = [
  { title: "Base", component: <BaseInformeAcreditacionCompetencias /> },
  { title: "Acreditación", component: <AcreditacionCompetenciasAcreditacionCompetencias /> },
  { title: "Procedimiento", component: <ProcedimientoGeneralAcreditacionCompetencias /> },
  { title: "Hábitos", component: <HabitosOperacionalesAcreditacionCompetencias /> },
  { title: "Gestión", component: <GestionDeControlAcreditacionCompetencias /> },
  { title: "Habilitación", component: <HabilitacionlAcreditacionCompetencias /> },
];


// FormAcreditacionCompetencias component
export default function FormAcreditacionCompetencias() {
  // State to manage the current step of the form
  const [currentStep, setCurrentStep] = useState(0);


  // Constants for the next and back buttons
  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const back = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };


// Content
  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Barra de progreso en 2 filas de 3 en mobile */}
      <div className="grid grid-cols-3 md:flex justify-between gap-4 mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold ${index <= currentStep ? "bg-blue-600" : "bg-gray-300"
                }`}
            >
              {index + 1}
            </div>
            <span className="text-[10px] md:text-xs text-center mt-1">{step.title}</span>
          </div>
        ))}
      </div>

      {/* Contenido del paso actual */}
      <div className="mb-6">{steps[currentStep].component}</div>

      {/* Botones de navegación */}
      <div className="flex justify-between mt-4">
        <Button onClick={back} disabled={currentStep === 0}>
          Atrás
        </Button>
        <Button onClick={next} disabled={currentStep === steps.length - 1}>
          Siguiente
        </Button>
      </div>
    </div>
  );
}
