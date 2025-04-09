// Todas las funciones relacionadas con la obtencion de los campos
// del auditor relacionado con el usuario que inicia sessión

//Obtención de datos del auditor relacionado con el usuario:
export interface Auditor {
    id: number;
    nombre: string;
    rut: string;
    cargo: string;
}

export async function getAuditor(username: string): Promise<Auditor> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/auditores?filters[user][username][$eq]=${username}`,
            {
                method: "GET",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Error al obtener los datos del auditor");
        }

        const data = await response.json();


        const auditor = data.data[0];
        return {
            id: auditor.id,
            nombre: auditor.Nombre,
            rut: auditor.Rut,
            cargo: auditor.Cargo,
        };
    } catch (error) {
        console.error("Error in getAuditor:", error);
        throw error;
    }
}



export interface AuditorPic {
    fotoUrl: string;

}

export async function getAuditorPicture(username: string): Promise<AuditorPic> {
    try {
        const response = await fetch(             
            `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/auditores?filters[user][username][$eq]=${username}&populate=Foto&fields[0]=id`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`

                },
            }
        );


        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Error al obtener los datos del auditor");
        }

        const data = await response.json();
        const picture = `${process.env.NEXT_PUBLIC_STRAPI_HOST}${data.data[0].Foto.formats.medium.url}` 

        return {
            fotoUrl: picture
        };

    } catch (error) {
        console.error("Error in getAuditor:", error);
        throw error;
    }
}