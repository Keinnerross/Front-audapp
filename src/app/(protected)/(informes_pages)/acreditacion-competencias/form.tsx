"use client";

import { useState } from "react";
import BaseInformeAcreditacionCompetencias, { BaseInformeData } from "./steps/base_informe";
import AcreditacionCompetenciasAcreditacionCompetencias, { AcreditacionData } from "./steps/acreditacion_competencias";
import ProcedimientoGeneralAcreditacionCompetencias, { ProcedimientoGeneralData } from "./steps/procedimiento_general";
import HabitosOperacionalesAcreditacionCompetencias, { HabitosOperacionalesData } from "./steps/habitos_operacionales";
import GestionDeControlAcreditacionCompetencias, { GestionDeControlData } from "./steps/gestion_de_control";
import HabilitacionlAcreditacionCompetencias, { HabilitacionData } from "./steps/habilitacion";
import Button from "@/components/ui/button/Button";

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
  scan_documento: null,
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

export default function FormAcreditacionCompetencias() {
  const [currentStep, setCurrentStep] = useState(0);

  const [baseData, setBaseData] = useState(initialBase);
  const [acreditacionData, setAcreditacionData] = useState(initialAcreditacion);
  const [procedimientoData, setProcedimientoData] = useState(initialProcedimiento);
  const [habitosData, setHabitosData] = useState(initialHabitos);
  const [gestionData, setGestionData] = useState(initialGestion);
  const [habilitacionData, setHabilitacionData] = useState(initialHabilitacion);

  const next = () => currentStep < steps.length - 1 && setCurrentStep((prev) => prev + 1);
  const back = () => currentStep > 0 && setCurrentStep((prev) => prev - 1);

  const token = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

  const uploadFile = async (file: File): Promise<number | null> => {
    const formData = new FormData();
    formData.append("files", file);
    try {
      const res = await fetch("http://localhost:1337/api/upload", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return data[0]?.id ?? null;
    } catch (error) {
      console.error("❌ Error al subir archivo:", error);
      return null;
    }
  };

  const replaceArchivos = async (requerimientos: any[]): Promise<any[]> => {
    return await Promise.all(
      requerimientos.map(async (item) => {
        if (!item.calificacion) return null; // filtrar inválidos

        const archivoId = item.archivos instanceof File
          ? await uploadFile(item.archivos)
          : item.archivos;

        return {
          nombre_requerimiento: item.nombre_requerimiento,
          calificacion: item.calificacion.toLowerCase(),
          comentario: item.comentario,
          recomendacion: item.recomendacion,
          archivos: archivoId ? [archivoId] : [],
        };
      })
    ).then((items) => items.filter(Boolean));
  };

  const uploadAllEvidence = async () => {
    const scanId = acreditacionData.scan_documento instanceof File
      ? await uploadFile(acreditacionData.scan_documento)
      : acreditacionData.scan_documento;

    return {
      acreditacion: {
        ...acreditacionData,
        scan_documento: scanId,
      },
      procedimiento: {
        ...procedimientoData,
        requerimientos: await replaceArchivos(procedimientoData.requerimientos),
      },

      habitos: {
        ...habitosData,
        requerimientos: await replaceArchivos(habitosData.requerimientos),
      },
    };
  };

  const submitForm = async () => {
    try {
      const evidencias = await uploadAllEvidence();

      const payload = {
        data: {
          base_informe: {
            nombre_informe: baseData.nombre_informe,
            fecha_informe: baseData.fecha || null,
            auditor: baseData.auditor || null,
            empresa: baseData.empresa || null,
            pdf_informe: [],
          },
          procedimiento_general: {
            calificacion: evidencias.procedimiento.calificacion_resumen?.toLowerCase() || null,
            observaciones: evidencias.procedimiento.observaciones_resumen,
            requerimiento: evidencias.procedimiento.requerimientos,
          },
          habitos_operacionales: {
            calificacion: evidencias.habitos.calificacion_resumen?.toLowerCase() || null,
            observaciones: evidencias.habitos.observaciones_resumen,
            requerimiento: evidencias.habitos.requerimientos,
          },
          nombre_auditor: acreditacionData.auditor,
          fecha_evaluacion: acreditacionData.fecha_evaluacion || null,
          evaluacion_teorica: acreditacionData.evaluacion_teorica,
          evaluacion_practica: acreditacionData.evaluacion_practica,
          evaluador: acreditacionData.evaluador,
          rut_evaluador: acreditacionData.rut_evaluador,
          observacion: acreditacionData.observaciones,
          scan_documento: evidencias.acreditacion.scan_documento
            ? [evidencias.acreditacion.scan_documento]
            : [],
        },
      };

      const res = await fetch("http://localhost:1337/api/informes-acreditacion-de-competencias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      const result = JSON.parse(text);

      if (res.ok) {
        alert("✅ Acreditación enviada con éxito");
      } else {
        console.error("❌ Error detallado desde Strapi:", result);
        alert(`❌ Error: ${result.error?.message ?? "Ver consola"}`);
      }
    } catch (error) {
      console.error("🚨 Error general al enviar:", error);
      alert("🚨 Error general. Ver consola.");
    }
  };

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
    // {
    //   title: "Acreditación",
    //   component: (
    //     <AcreditacionCompetenciasAcreditacionCompetencias
    //       data={acreditacionData}
    //       onChange={(value) => setAcreditacionData((prev) => ({ ...prev, ...value }))}
    //     />
    //   ),
    // },
    { title: "Procedimiento", component: <ProcedimientoGeneralAcreditacionCompetencias data={procedimientoData} onChange={(value) => setProcedimientoData((prev) => ({ ...prev, ...value }))} /> },
    // { title: "Hábitos", component: <HabitosOperacionalesAcreditacionCompetencias data={habitosData} onChange={(value) => setHabitosData((prev) => ({ ...prev, ...value }))} /> },
    // { title: "Gestión", component: <GestionDeControlAcreditacionCompetencias data={gestionData} onChange={(value) => setGestionData((prev) => ({ ...prev, ...value }))} /> },
    // { title: "Habilitación", component: <HabilitacionlAcreditacionCompetencias data={habilitacionData} onChange={(value) => setHabilitacionData((prev) => ({ ...prev, ...value }))} /> },
  ];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="grid grid-cols-3 md:flex justify-between gap-4 mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold ${index <= currentStep ? "bg-blue-600" : "bg-gray-300"}`}
            >
              {index + 1}
            </div>
            <span className="text-[10px] md:text-xs text-center mt-1">{step.title}</span>
          </div>
        ))}
      </div>
      <div className="mb-6">{steps[currentStep].component}</div>
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
