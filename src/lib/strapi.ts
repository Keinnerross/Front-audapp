const host = process.env.NEXT_PUBLIC_STRAPI_HOST;
const token = process.env.NEXT_PUBLIC_STRAPI_TOKEN;


//Función para hacer una consulta GET a la API de Strapi:
// Se utiliza para obtener datos de la API de Strapi

interface ApiResponse<T = unknown> {
  data: T;
  error?: {
    message: string;
  };
}

export async function getQuery<T = unknown>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${host}/api/${url}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: T = await response.json();
    return { data };
  } catch (error) {
    console.error("Error in getQuery:", error);
    throw error;
  }
}













