

//Obtener todos los auditores:
import { getQuery } from './strapi';

const urlProcedimientoGeneral = "informes-acreditacion-de-competencias/eugs99z2027taabftj69ilv8?populate[procedimiento_general][populate]=requerimiento";
const urlHabitosOperacionales = "informes-acreditacion-de-competencias/eugs99z2027taabftj69ilv8?populate[habitos_operacionales][populate]=requerimiento";
const urlGestionDeControl = "informes-acreditacion-de-competencias/eugs99z2027taabftj69ilv8?populate[gestion_de_control][populate]=requerimiento";
const urlHabilitacion = "informes-acreditacion-de-competencias/eugs99z2027taabftj69ilv8?populate[habilitacion][populate]=requerimiento";

interface Requerimiento {
    id: number;
    attributes: {
        nombre_requerimiento: string;
        calificacion: string;
        comentario: string;
        recomendación: string;
        archivos: string;

    };
}



export const getRequerimientosProcedimientoGeneral = async () => {
    const response = await getQuery<{ data: Requerimiento[] }>(urlProcedimientoGeneral);
    const data = response.data.data.procedimiento_general.requerimiento;
    return data;    
};


export const getRequerimientosHabitosOperacionales = async () => {
    const response = await getQuery<{ data: Requerimiento[] }>(urlHabitosOperacionales);
    const data = response.data.data.habitos_operacionales.requerimiento;
    return data;    
};


export const getRequerimientosGestionDeControl = async () => {
    const response = await getQuery<{ data: Requerimiento[] }>(urlGestionDeControl);
    const data = response.data.data.gestion_de_control.requerimiento;
    return data;    
};



export const getRequerimientosHabilitacion = async () => {
    const response = await getQuery<{ data: Requerimiento[] }>(urlHabilitacion);
    const data = response.data.data.habilitacion.requerimiento;
    return data;    
};



//POST GENERAR PDF

export const generarPDF = async (payload: any) => {
    const token = process.env.NEXT_PUBLIC_STRAPI_TOKEN;
  
    try {
      const res = await fetch("http://localhost:1337/api/informes-acreditacion-de-competencias/generar-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload), 
      });
  
      const result = await res.json();
  
      if (!res.ok) {
        console.error("❌ Error al generar PDF:", result.error || result);
        alert("❌ Falló la generación del PDF. Ver consola.");
        return null;
      }
  
      console.log("✅ PDF generado:", result);
      // alert("✅ PDF generado y subido con éxito");
      
      return result;
  
    } catch (error) {
      console.error("❌ Error general al llamar a generarPDF:", error);
      alert("❌ Error general al generar PDF");
      return null;
    }
  };
  