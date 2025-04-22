// 🧠 Utilidad para formatear fecha sin errores

export const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    d.setMinutes(d.getMinutes() - offset); // corrige zona horaria
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
};

export const formatDateLargo = (date: Date | string | null | undefined): string => {
    if (!date) return "";
    const d = new Date(date);
    return isNaN(d.getTime())
        ? ""
        : d.toLocaleDateString("es-CL", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
};