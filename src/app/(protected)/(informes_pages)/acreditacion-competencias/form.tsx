"use client";

import { useState } from "react";
import BaseInformeAcreditacionCompetencias, { BaseInformeData } from "./steps/base_informe";
import AcreditacionCompetenciasAcreditacionCompetencias, { AcreditacionData } from "./steps/acreditacion_competencias";
import ProcedimientoGeneralAcreditacionCompetencias, { ProcedimientoGeneralData } from "./steps/procedimiento_general";
import HabitosOperacionalesAcreditacionCompetencias, { HabitosOperacionalesData } from "./steps/habitos_operacionales";
import GestionDeControlAcreditacionCompetencias, { GestionDeControlData } from "./steps/gestion_de_control";
import HabilitacionlAcreditacionCompetencias, { HabilitacionData } from "./steps/habilitacion";
import Button from "@/components/ui/button/Button";

// ------------------------------
// Valores iniciales de cada paso
// ------------------------------
const initialBase: BaseInformeData = {
  nombre_informe: "",
  fecha: "",
  auditor: "",
  empresa: "",
};

const initialAcreditacion: AcreditacionData = {
  auditor: "",
  fecha_evaluacion: "",
  evaluacion_teorica: "",
  evaluacion_practica: "",
  evaluador: "",
  rut_evaluador: "",
  observaciones: "",
  evidencia: null,
};

const initialProcedimiento: ProcedimientoGeneralData = {
  requerimientos: [],
  calificacion_resumen: "",
  observaciones_resumen: "",
};

const initialHabitos: HabitosOperacionalesData = {
  requerimientos: [],
  calificacion_resumen: "",
  observaciones_resumen: "",
};

const initialGestion: GestionDeControlData = {
  requerimientos: [],
  calificacion_resumen: "",
  observaciones_resumen: "",
};

const initialHabilitacion: HabilitacionData = {
  requerimientos: [],
  calificacion_resumen: "",
  observaciones_resumen: "",
};

// ------------------------------
// Componente principal
// ------------------------------
export default function FormAcreditacionCompetencias() {
  const [currentStep, setCurrentStep] = useState(0);

  // Estados globales por paso
  const [baseData, setBaseData] = useState<BaseInformeData>(initialBase);
  const [acreditacionData, setAcreditacionData] = useState<AcreditacionData>(initialAcreditacion);
  const [procedimientoData, setProcedimientoData] = useState<ProcedimientoGeneralData>(initialProcedimiento);
  const [habitosData, setHabitosData] = useState<HabitosOperacionalesData>(initialHabitos);
  const [gestionData, setGestionData] = useState<GestionDeControlData>(initialGestion);
  const [habilitacionData, setHabilitacionData] = useState<HabilitacionData>(initialHabilitacion);

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const back = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  // Simulación de envío final
  const submitForm = () => {
    const fullData = {
      ...baseData,
      acreditacion: acreditacionData,
      procedimiento: procedimientoData,
      habitos: habitosData,
      gestion: gestionData,
      habilitacion: habilitacionData,
    };

    console.log("Formulario completo listo para enviar 💥:", fullData);
    // Aquí más adelante: await fetch("http://localhost:1337/api/tu-endpoint", {...})
  };

  // Steps configurados
  const steps = [
    {
      title: "Base",
      component: (
        <BaseInformeAcreditacionCompetencias
          data={baseData}
          onChange={(value) => setBaseData((prev) => ({ ...prev, ...value }))}
        />
      ),
    },
    {
      title: "Acreditación",
      component: (
        <AcreditacionCompetenciasAcreditacionCompetencias
          data={acreditacionData}
          onChange={(value) => setAcreditacionData((prev) => ({ ...prev, ...value }))}
        />
      ),
    },
    {
      title: "Procedimiento",
      component: (
        <ProcedimientoGeneralAcreditacionCompetencias
          data={procedimientoData}
          onChange={(value) => setProcedimientoData((prev) => ({ ...prev, ...value }))}
        />
      ),
    },
    {
      title: "Hábitos",
      component: (
        <HabitosOperacionalesAcreditacionCompetencias
          data={habitosData}
          onChange={(value) => setHabitosData((prev) => ({ ...prev, ...value }))}
        />
      ),
    },
    {
      title: "Gestión",
      component: (
        <GestionDeControlAcreditacionCompetencias
          data={gestionData}
          onChange={(value) => setGestionData((prev) => ({ ...prev, ...value }))}
        />
      ),
    },
    {
      title: "Habilitación",
      component: (
        <HabilitacionlAcreditacionCompetencias
          data={habilitacionData}
          onChange={(value) => setHabilitacionData((prev) => ({ ...prev, ...value }))}
        />
      ),
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Progreso */}
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

      {/* Contenido */}
      <div className="mb-6">{steps[currentStep].component}</div>

      {/* Navegación */}
      <div className="flex justify-between mt-4">
        <Button onClick={back} disabled={currentStep === 0}>Atrás</Button>
        {currentStep < steps.length - 1 ? (
          <Button onClick={next}>Siguiente</Button>
        ) : (
          <Button onClick={submitForm}>Enviar</Button>
        )}
      </div>
    </div>
  );
}
