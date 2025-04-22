const host = process.env.NEXT_PUBLIC_STRAPI_HOST;
const token = process.env.NEXT_PUBLIC_STRAPI_TOKEN;






export const crearOperador = async (
  operadores: { nombre_operador: string; rut_operador: string }[] | null | undefined,
  empresas: string
): Promise<string[]> => {
  const documentIds: string[] = [];

  // console.log(operadores);

  if (!operadores || operadores.length === 0) {
    console.warn("👻 No se proporcionaron operadores para crear.");
    return documentIds;
  }


  const operadoresValidos = operadores.filter(
    (op) => op.nombre_operador?.trim() && op.rut_operador?.trim()
  );

  if (operadoresValidos.length === 0) {
    console.warn("⚠️ Todos los operadores estaban vacíos.");
    return documentIds;
  }

  for (const operador of operadoresValidos) {
    const payload = {
      data: {
        Nombre: operador.nombre_operador,
        Rut: operador.rut_operador,
        Empresa: empresas || null,
      },
    };

    try {
      const res = await fetch(`${host}/api/operadores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("📛 Error al guardar operador:", result.error?.message);
        console.error("🧩 Detalles:", JSON.stringify(result.error?.details, null, 2));
        alert("❌ Error al guardar operador. Ver consola.");
      } else {
        const documentId = result.data.documentId;
        if (documentId) {
          documentIds.push(documentId);
        } else {
          console.warn("⚠️ El operador no tiene documentId:", result.data);
        }
      }
    } catch (error) {
      console.error("🚨 Error de red:", error);
      alert("🚨 Error al conectar con el servidor.");
    }
  }

  return documentIds;
};




export const fetchOperadoresPorEmpresaDocumentId = async (
  documentId: string
): Promise<{ nombre_operador: string; rut_operador: string }[]> => {
  if (!documentId) {
    console.warn("⚠️ No se proporcionó un documentId.");
    return [];
  }
  const url = `${host}/api/operadores?filters[Empresa][documentId][$eq]=${documentId}&pagination[limit]=100`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();

  return json.data.data
};