import { getQuery } from "./strapi";

interface PDFFile {
  id: number;
  url: string;
  name: string;
}

export const getPDFUrlById = async (id: number): Promise<string | null> => {
  try {
    const response = await getQuery<PDFFile>(`upload/files/${id}`);
    const file = response.data;

    if (!file || !file.url) return null;

    return `${process.env.NEXT_PUBLIC_STRAPI_HOST}${file.url}`;
  } catch (error) {
    console.error("❌ Error al obtener PDF:", error);
    return null;
  }
};
