

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
