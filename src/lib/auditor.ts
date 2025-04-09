

//Obtener todos los auditores:
import { getQuery } from './strapi';

interface Auditor {
  id: number;
  attributes: {
    nombre: string;

  };
}

export const getAuditores = async () => {
    const response = await getQuery<{ data: Auditor[] }>('auditores?populate=*');
    console.log(response.data.data)
    return response.data.data; // ✅ ya es el array
  };
