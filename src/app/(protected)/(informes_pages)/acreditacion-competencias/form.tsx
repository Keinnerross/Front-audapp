"use client";

import { useState } from "react";
import BaseInformeAcreditacionCompetencias, { BaseInformeData } from "./steps/base_informe";
import AcreditacionCompetenciasAcreditacionCompetencias, { AcreditacionData } from "./steps/acreditacion_competencias";
import Button from "@/components/ui/button/Button";
import ComponenteRequerimientos, { ComponenteData } from "@/components/audapp/componenteRequerimientos";
import { getRequerimientosHabitosOperacionales, getRequerimientosGestionDeControl, getRequerimientosHabilitacion, getRequerimientosProcedimientoGeneral, generarPDF } from "@/lib/informe _acreditación";
import LoadingOverlay from "@/components/common/loaderFullPage";
import { useRouter } from "next/navigation";




const initialBase: BaseInformeData = {
  nombre_informe: "",
  fecha: "",
  auditor: [],
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

const initialConRequerimientos: ComponenteData = {
  requerimientos: [],
  calificacion_resumen: "",
  observaciones_resumen: "",
};


export default function FormAcreditacionCompetencias() {
  const [currentStep, setCurrentStep] = useState(0);

  const [baseData, setBaseData] = useState(initialBase);
  const [acreditacionData, setAcreditacionData] = useState(initialAcreditacion);
  const [procedimientoData, setProcedimientoData] = useState(initialConRequerimientos);
  const [habitosData, setHabitosData] = useState(initialConRequerimientos);
  const [gestionData, setGestionData] = useState(initialConRequerimientos);
  const [habilitacionData, setHabilitacionData] = useState(initialConRequerimientos);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const router = useRouter();


  const next = () => currentStep < steps.length - 1 && setCurrentStep((prev) => prev + 1);
  const back = () => currentStep > 0 && setCurrentStep((prev) => prev - 1);

  const updateData = (value: any, setstate: any) => {
    setstate((prev: any) => ({ ...prev, ...value }))
  }

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
        if (!item || !item.nombre_requerimiento) return null; // ⚠️ protección extra

        let archivoIds: number[] = [];

        if (Array.isArray(item.archivos)) {
          const uploads = await Promise.all(
            item.archivos.map(async (file: File) => {
              if (file instanceof File) return await uploadFile(file);
              return file; // ya es ID
            })
          );
          archivoIds = uploads.filter(Boolean);
        }

        console.log(archivoIds);
        return {
          nombre_requerimiento: item.nombre_requerimiento,
          calificacion: item.calificacion?.toLowerCase() || null,
          comentario: item.comentario || "",
          recomendacion: item.recomendacion || "",
          archivos: archivoIds ? archivoIds : [],
        };
      })
    ).then(items => items.filter(Boolean)); // ⚠️ elimina nulls
  };



  const uploadAllEvidence = async () => {

    const scanIds = Array.isArray(acreditacionData.scan_documento)
      ? await Promise.all(
        acreditacionData.scan_documento.map(async (file: File) =>
          file instanceof File ? await uploadFile(file) : file
        )
      )
      : [];

    return {
      acreditacion: {
        ...acreditacionData,
        scan_documento: scanIds,
      },
      procedimiento: {
        ...procedimientoData,
        requerimientos: await replaceArchivos(procedimientoData.requerimientos),
      },
      habitos: {
        ...habitosData,
        requerimientos: await replaceArchivos(habitosData.requerimientos),
      },

      gestion: {
        ...gestionData,
        requerimientos: await replaceArchivos(gestionData.requerimientos),
      },
      habilitacion: {
        ...habilitacionData,
        requerimientos: await replaceArchivos(habilitacionData.requerimientos),
      },
    };
  };

  const submitForm = async () => {
    // o usa este hook dentro del componente si aún no está

    console.log(acreditacionData)

    try {
      setLoading(true); // ⏳ Inicia loading

      const evidencias = await uploadAllEvidence();

      const payload = {
        data: {
          base_informe: {
            nombre_informe: baseData.nombre_informe,
            fecha_informe: baseData.fecha || null,
            auditor: baseData.auditor || null,
            empresa: baseData.empresa || null,
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
          gestion_de_control: {
            calificacion: evidencias.gestion.calificacion_resumen?.toLowerCase() || null,
            observaciones: evidencias.gestion.observaciones_resumen,
            requerimiento: evidencias.gestion.requerimientos,
          },
          habilitacion: {
            calificacion: evidencias.habilitacion.calificacion_resumen?.toLowerCase() || null,
            observaciones: evidencias.habilitacion.observaciones_resumen,
            requerimiento: evidencias.habilitacion.requerimientos,
          },
          nombre_auditor: acreditacionData.auditor,
          fecha_evaluacion: acreditacionData.fecha_evaluacion || null,
          evaluacion_teorica: acreditacionData.evaluacion_teorica,
          evaluacion_practica: acreditacionData.evaluacion_practica,
          evaluador: acreditacionData.evaluador,
          rut_evaluador: acreditacionData.rut_evaluador,
          observacion: acreditacionData.observaciones,
          scan_documento: evidencias.acreditacion.scan_documento
            ? evidencias.acreditacion.scan_documento
            : [],
        },
      };

      // Crear entrada en Strapi
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/informes-acreditacion-de-competencias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("📛 Error al guardar informe:", result.error?.message);
        console.error("🧩 Detalles:", JSON.stringify(result.error?.details, null, 2));

        alert("❌ Error al guardar informe. Ver consola.");
        setLoading(false);
        return;
      }

      const idAcreditacion = result.data.id;

      // Generar PDF
      const pdfRes = await generarPDF({
        ...payload.data,
        id_acreditacion: idAcreditacion,
      });

      if (pdfRes?.archivo?.id) {
        const archivoId = pdfRes.archivo.id;
        router.push(`/pdf-generated/${archivoId}`);
      } else {
        alert("❌ No se pudo generar correctamente el PDF.");
      }

    } catch (error) {
      console.error("🚨 Error general en submitForm:", error);
      alert("🚨 Ocurrió un error al enviar. Ver consola.");
    } finally {
      setLoading(false);
    }
  };


  const steps = [
    {
      title: "Base",
      component: (
        <BaseInformeAcreditacionCompetencias
          data={baseData}
          updateData={(value) => updateData(value, setBaseData)}
        />
      ),
    },
    {

      title: "Acreditación",
      component: (
        <AcreditacionCompetenciasAcreditacionCompetencias
          data={acreditacionData}
          updateData={(value) => updateData(value, setAcreditacionData)}
        />
      ),
    },

    // {
    //   title: "Procedimiento",
    //   component: (
    //     <ComponenteRequerimientos
    //       key='procedimiento'
    //       title="Procedimiento General"
    //       data={procedimientoData}
    //       updateData={(value) => updateData(value, setProcedimientoData)}
    //       fetchRequerimientos={getRequerimientosProcedimientoGeneral}
    //     />
    //   ),
    // },
    // {
    //   title: "Hábitos",
    //   component: (
    //     <ComponenteRequerimientos
    //       key='habitos'
    //       title="Habitos Operacionales"
    //       data={habitosData}
    //       updateData={(value) => updateData(value, setHabitosData)}
    //       fetchRequerimientos={getRequerimientosHabitosOperacionales}
    //     />
    //   ),
    // },

    // {
    //   title: "Gestión",
    //   component: (
    //     <ComponenteRequerimientos
    //       key="gestion"
    //       title="Gestión de control"
    //       data={gestionData}
    //       updateData={(value) => updateData(value, setGestionData)}
    //       fetchRequerimientos={getRequerimientosGestionDeControl}

    //     />
    //   ),
    // },
    // {
    //   title: "Habilitación",
    //   component: (
    //     <ComponenteRequerimientos
    //       key="habilitacion"
    //       title="Habilitación"
    //       data={habilitacionData}
    //       updateData={(value) => updateData(value, setHabilitacionData)}
    //       fetchRequerimientos={getRequerimientosHabilitacion}
    //     />
    //   ),
  ];

  return (
    <div className=" mx-auto p-4">
      <LoadingOverlay isLoading={loading} />

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