"use client";

import { useState } from "react";
import BaseInformeAcreditacionCompetencias, { BaseInformeData } from "./steps/base_informe";
import AcreditacionCompetenciasAcreditacionCompetencias from "./steps/acreditacion_competencias";
import Button from "@/components/ui/button/Button";
import ComponenteRequerimientos, { ComponenteData } from "@/components/audapp/componenteRequerimientos";
import { getRequerimientosGestionDeControl, getRequerimientosHabilitacion, getRequerimientosProcedimientoGeneral, generarPDF } from "@/lib/informe _acreditación";
import LoadingOverlay from "@/components/common/LoaderFullPage";
import { useRouter } from "next/navigation";
import HabitosAcreditacionCompetencias from "./steps/habitos_operacionales";
import { crearOperador } from "@/lib/operadores";
import { HabitosData } from "@/components/audapp/acreditacion-competencias/habitosOperacionalesComponente";
import { AcreditacionData } from "@/components/audapp/acreditacion-competencias/acreditacionCompetenciasComponent";
import { ValidationResult, validateRequired, VALIDAR } from "@/utils/validationsForm";
import ResumenDelInforme from "@/components/audapp/resumenDelInforme";







//Informacion con la que se inicializa cada form:
const initialBase: BaseInformeData = {
  nombre_informe: "",
  fecha: "",
  auditor: [],
  empresa: "",
};

const initialAcreditacion: { acreditacion_single: AcreditacionData[] } = {
  acreditacion_single: [{} as AcreditacionData]
};
const initialHabitos: { habitos_single: HabitosData[] } = {
  habitos_single: [{} as HabitosData] //este nombre es solo en el front.
};

const initResumenFinal: { resumen_final: string } = {
  resumen_final: ""
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
  const [habitosData, setHabitosData] = useState(initialHabitos);
  const [gestionData, setGestionData] = useState(initialConRequerimientos);
  const [habilitacionData, setHabilitacionData] = useState(initialConRequerimientos);
  const [resumenFinal, setResumenFinal] = useState(initResumenFinal);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const router = useRouter();


  // Agrega esta interfaz al inicio del archivo
  interface ValidationResult {
    isValid: boolean;
    errorMessage?: string;
  }

  // Luego define las funciones de validación para cada paso

  const validateSteps = {
    base: (data: BaseInformeData): ValidationResult => {
      if (!VALIDAR) return { isValid: true };

      return (
        validateRequired(data.nombre_informe, "El nombre del informe es requerido") ||
        validateRequired(data.fecha, "La fecha es requerida") ||
        validateRequired(data.auditor, "Debe seleccionar al menos un auditor") ||
        validateRequired(data.empresa, "La empresa es requerida") ||
        { isValid: true }
      );
    },

    acreditacion: (data: { acreditacion_single: AcreditacionData[] }): ValidationResult => {
      if (!VALIDAR) return { isValid: true };

      for (const item of data.acreditacion_single) {
        return (
          validateRequired(item.rut_operador, "El RUT del operador es requerido") ||
          validateRequired(item.evaluacion_teorica, "La fecha de evaluación teórica es requerida") ||
          validateRequired(item.evaluacion_practica, "La fecha de evaluación práctica es requerida") ||
          validateRequired(item.evaluador, "El nombre del evaluador es requerido") ||
          validateRequired(item.rut_evaluador, "El RUT del evaluador es requerido") ||
          { isValid: true }
        );
      }

      return { isValid: true };
    },

    habitos: (data: { habitos_single: HabitosData[] }): ValidationResult => {
      if (!VALIDAR) return { isValid: true };

      for (const item of data.habitos_single) {
        return (
          validateRequired(item.rut_operador, "Faltan campos por completar") ||
          validateRequired(item.fecha_acreditacion, "Faltan campos por completar") ||
          { isValid: true }
        );
      }

      return { isValid: true };
    },

    habilitacion: (data: ComponenteData): ValidationResult => {
      if (!VALIDAR) return { isValid: true };

      return (
        validateRequired(data.requerimientos, "Faltan requerimientos por evaluar") ||
        validateRequired(data.calificacion_resumen, "La calificación general de la sección es requerida") ||
        { isValid: true }
      );
    },

    procedimiento: (data: ComponenteData): ValidationResult => {
      if (!VALIDAR) return { isValid: true };

      return (
        validateRequired(data.requerimientos, "Faltan requerimientos por evaluar") ||
        validateRequired(data.calificacion_resumen, "La calificación general de la sección es requerida") ||
        { isValid: true }
      );
    },

    gestion: (data: ComponenteData): ValidationResult => {
      if (!VALIDAR) return { isValid: true };

      return (
        validateRequired(data.requerimientos, "Faltan requerimientos por evaluar") ||
        validateRequired(data.calificacion_resumen, "La calificación general de la sección es requerida") ||
        { isValid: true }
      );
    },

    resumenFinal: (data: { resumen_final: string }): ValidationResult => {
      if (!VALIDAR) return { isValid: true };
      return validateRequired(data.resumen_final, "El resumen final es requerido") || { isValid: true };
    }
  };


  const next = () => {
    // Validar el paso actual antes de avanzar
    let validation: ValidationResult = { isValid: true };

    switch (currentStep) {
      case 0:
        validation = validateSteps.base(baseData);
        break;
      case 1:
        validation = validateSteps.acreditacion(acreditacionData);
        break;
      case 2:
        validation = validateSteps.habitos(habitosData);
        break;
      case 3:
        validation = validateSteps.habilitacion(habilitacionData);
        break;
      case 4:
        validation = validateSteps.procedimiento(procedimientoData);
        break;
      case 5:
        validation = validateSteps.gestion(gestionData);
        break;
    }

    if (!validation.isValid) {
      alert(validation.errorMessage || "Por favor complete todos los campos requeridos");
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };
  const back = () => currentStep > 0 && setCurrentStep((prev) => prev - 1);

  const updateData = (value: any, setstate: any) => {
    setstate((prev: any) => ({ ...prev, ...value }))
  }

  const token = process.env.NEXT_PUBLIC_STRAPI_TOKEN;
  const host = process.env.NEXT_PUBLIC_STRAPI_HOST;

  //Funcion que sube los archivos a strapi y retorna el ID del archivo subido.
  const uploadFile = async (file: File): Promise<number | null> => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      const res = await fetch(`${host}/api/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      return data?.[0]?.id ?? null;
    } catch (error) {
      console.error("❌ Error al subir archivo:", error);
      return null;
    }
  };



  //Esta funcion remplaza los archivos de los requerimientos por los IDs de los archivos subidos a strapi.
  //Recibe un array de requerimientos y devuelve un array de requerimientos con los IDs de los archivos subidos a strapi.
  //Hace uso de la funcion UpdateFile para subir los archivos a strapi y obtener el ID del archivo subido.
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



  const replaceArchivosAcreditacion = async (
    acreditacionSingle: any[],
    operadorIds: string[] // o number[], según uses
  ): Promise<any[]> => {
    return await Promise.all(
      acreditacionSingle.map(async (item, i) => {
        let archivoIds: number[] = [];

        if (Array.isArray(item.scan_documento)) {
          const uploads = await Promise.all(
            item.scan_documento.map(async (file: File) => {
              if (file instanceof File) return await uploadFile(file);
              return file; // ya es ID
            })
          );
          archivoIds = uploads.filter(Boolean);
        }

        return {
          operador: operadorIds[i], // 👈
          rut_operador: item.rut_operador,
          fecha_evaluacion: item.fecha_evaluacion,
          fecha_evaluacion_teorica: item.evaluacion_teorica,
          fecha_evaluacion_practica: item.evaluacion_practica,
          evaluador: item.evaluador,
          rut_evaluador: item.rut_evaluador,
          observaciones: item.observaciones,
          scan_documento: archivoIds, // 👈
        };
      })
    ).then(items => items.filter(Boolean));
  };


  const replaceDataHabitos = async (habitosSingle: any[], operadores: string[]) => {

    return habitosSingle.map((item, i) => ({
      operador: operadores[i],
      rut_operador: item.rut_operador,
      fecha_acreditacion: item.fecha_acreditacion,
      fecha_vigencia_licencia_interna: item.fecha_vigencia_licencia_interna,
      resultado: item.resultado,
      habitos_operacionales_realizados: item.habitos_operacionales_realizados,
      situacion_actual: item.situacion_actual,
      conclusion_recomendacion: item.conclusion_recomendacion
    }))
  }



  //Hace uso de la funcion de remplazar los files por las Ids previamente subidas a strapi.
  const dataWithMediaUpdate = async (resOperadorDocIdsAcreditacion: string[], resOperadorDocIdsHabitos: string[]) => {
    // Retorna la data con los los ids de los archivos subidos a strapi.
    return {
      acreditacion: {
        acreditacion_single: await replaceArchivosAcreditacion(acreditacionData.acreditacion_single, resOperadorDocIdsAcreditacion),
      },

      habitos: {
        habitos_single: await replaceDataHabitos(habitosData.habitos_single, resOperadorDocIdsHabitos),
      },
      procedimiento: {
        ...procedimientoData,
        requerimientos: await replaceArchivos(procedimientoData.requerimientos),
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


    const validations = [
      validateSteps.base(baseData),
      validateSteps.acreditacion(acreditacionData),
      validateSteps.habitos(habitosData),
      validateSteps.habilitacion(habilitacionData),
      validateSteps.procedimiento(procedimientoData),
      validateSteps.gestion(gestionData),
      validateSteps.resumenFinal(resumenFinal)
    ];

    const invalidStep = validations.findIndex(v => !v.isValid);
    if (invalidStep !== -1) {
      setCurrentStep(invalidStep); // Ir al paso con error
      alert(validations[invalidStep].errorMessage || `Por favor complete todos los campos requeridos en el paso ${invalidStep + 1}`);
      return;
    }


    // o usa este hook dentro del componente si aún no está
    try {
      setLoading(true); // ⏳ Inicia loading

      //#1
      //Se suben los operadores a la base de datos de strapi retornando los Ids para sociarlos al playLoad del informe.
      //Se envía de igua forma el valor de la empresa para poder asociarlo, la funcion se encarga de gestionar la logica del POST.
      const resOperadorDocIdsAcreditacion = await crearOperador(acreditacionData.acreditacion_single, baseData.empresa); //Se obtienen las Ids de los Operadores asociados a Acreditacion
      const resOperadorDocIdsHabitos = await crearOperador(habitosData.habitos_single, baseData.empresa); // Se obtienen las Ids de los operadores asociados a Habitos




      //#2
      //Se suben todos los archivos e imagenes de los formularios
      //Esta funcion tiene dentro otras funciones que se sencargan de la subida y de organzar la informacion.
      //Al final retorna cada una de la informacion formateada, es decir en los campos "archivos ó media" se encuentran los IDs de los archivos subidos a strapi.
      //Se guarda en una variable la data formateada para ser usada en el playload.
      const dataFormated = await dataWithMediaUpdate(resOperadorDocIdsAcreditacion, resOperadorDocIdsHabitos);



      // #3 Preparamos el playload.
      const payload = {
        data: {
          base_informe: {
            nombre_informe: baseData.nombre_informe,
            fecha_informe: baseData.fecha || null,
            auditor: baseData.auditor || null,
            empresa: baseData.empresa || null,
          },
          procedimiento_general: {
            calificacion: dataFormated.procedimiento.calificacion_resumen?.toLowerCase() || null,
            observaciones: dataFormated.procedimiento.observaciones_resumen,
            requerimiento: dataFormated.procedimiento.requerimientos,
          },

          gestion_de_control: {
            calificacion: dataFormated.gestion.calificacion_resumen?.toLowerCase() || null,
            observaciones: dataFormated.gestion.observaciones_resumen,
            requerimiento: dataFormated.gestion.requerimientos,
          },
          habilitacion: {
            calificacion: dataFormated.habilitacion.calificacion_resumen?.toLowerCase() || null,
            observaciones: dataFormated.habilitacion.observaciones_resumen,
            requerimiento: dataFormated.habilitacion.requerimientos,
          },
          acreditacion_competencias:
            dataFormated.acreditacion.acreditacion_single.map((item) => ({
              __component: "informe-acreditacion.acreditacion-competencias",
              ...item,
            })),

          habitos_operacionales:
            dataFormated.habitos.habitos_single.map((item) => ({
              __component: "informe-acreditacion.habitos-operacionales",
              ...item,
            })),
            
          resumen_final: resumenFinal.resumen_final || "",
        }
      };



      console.log(payload.data);


      // Crear entrada en Strapi POST FUNCTION
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
    // {
    //   title: "Acreditación",
    //   component: (
    //     <AcreditacionCompetenciasAcreditacionCompetencias
    //       data={acreditacionData}
    //       updateData={(value) => updateData(value, setAcreditacionData)}
    //     />
    //   ),
    // },
    // {
    //   title: "Hábitos",
    //   component: (
    //     <HabitosAcreditacionCompetencias
    //       data={habitosData}
    //       updateData={(value) => updateData(value, setHabitosData)}
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
    // },
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

    {
      title: 'Resumen Final',

      component: (
        <ResumenDelInforme
          key="resumenFinal"
          data={resumenFinal}
          updateData={(value) => updateData(value, setResumenFinal)}
        />
      ),
    }

  ];

  return (
    <div className="pt-4">
      <LoadingOverlay isLoading={loading} />

      <div className="grid grid-cols-3 md:flex justify-between gap-4 mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold ${index <= currentStep ? "bg-blue-600" : "bg-gray-300"}`}
            >
              {index + 1}
            </div>
            <span className="text-[10px] md:text-xs text-center mt-1 text-gray-700 dark:text-gray-400">{step.title}</span>
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