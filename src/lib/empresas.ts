

//Obtener todos los auditores:
import { getQuery } from './strapi';

interface Empresas {
  id: number;
  attributes: {
    nombre: string;

  };
}

export const getEmpresas = async () => {
    const response = await getQuery<{ data: Empresas[] }>('empresas?populate=*');
    // console.log(response.data.data)
    return response.data.data; // ✅ ya es el array
  };
