"use client";

import React, { useEffect, useState } from "react";
import { Section } from "@/components/ui/section/section";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import TextAreaInput from "@/components/form/form-elements/TextAreaInput";
import DropzoneComponent from "@/components/form/form-elements/DropZone";

// Tipos
export interface ComponenteRequerimiento {
    nombre_requerimiento: string;
    calificacion: string;
    comentario: string;
    recomendacion: string;
    archivos: File | null;
}

export interface ComponenteData {
    requerimientos: ComponenteRequerimiento[];
    calificacion_resumen: string;
    observaciones_resumen: string;
}

interface Props {
    title: string;
    data: ComponenteData;
    updateData: (value: Partial<ComponenteData>) => void;
    fetchRequerimientos: () => Promise<any[]>;
}

export default function ComponenteRequerimientos({ title, data, updateData, fetchRequerimientos }: Props) {
    const calificaciones = ["cumple", "no cumple", "oportunidad de mejora", "no aplica"];
    const calificacionesResumen = ["conforme", "no conforme", "con observaciones", "no aplica"];
    const [requerimientosAPI, setRequerimientosAPI] = useState<any[]>([]);

    const calificacionesOptions = calificaciones.map((c) => ({ value: c, label: c }));

    const calificacionesResumenOptions = calificacionesResumen.map((c) => ({ value: c, label: c }));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchRequerimientos();
                setRequerimientosAPI(res);

                const requerimientosIniciales = res.map((item: any) => ({
                    nombre_requerimiento: item.nombre_requerimiento,
                    calificacion: null,
                    comentario: "",
                    recomendacion: "",
                    archivos: null,
                }));

                updateData({ requerimientos: requerimientosIniciales });
            } catch (error) {
                console.error("Error cargando requerimientos:", error);
            }
        };

        fetchData();
    }, []);


    const updateRequerimiento = (index: number, newData: Partial<ComponenteRequerimiento>) => {
        const updated = [...data.requerimientos];
        const current = updated[index] || {};
        updated[index] = {
            ...current,
            ...newData,
            nombre_requerimiento: requerimientosAPI[index]?.nombre_requerimiento || current.nombre_requerimiento || "",
        };
        updateData({ requerimientos: updated });
    };

    return (
        <div className="pb-10">
            <div id="form-habitos" className="p-6 space-y-10">
                <Section title={title}>
                    <div className="flex flex-col gap-14">
                        {requerimientosAPI.map((requerimiento, index) => (
                            <div key={index} className="flex flex-col gap-4">
                                <Label className="text-base">
                                    <span>{index + 1}) </span>{requerimiento.nombre_requerimiento}
                                </Label>

                                <Select
                                    options={calificacionesOptions}
                                    placeholder="Selecciona una calificación"
                                    value={data.requerimientos[index]?.calificacion || ""}
                                    required={true}
                                    onChange={(value) => updateRequerimiento(index, { calificacion: value })}
                                />

                                <TextAreaInput
                                    name={`comentario_${index}`}
                                    label="Comentario"
                                    defaultValue={data.requerimientos[index]?.comentario || ""}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        updateRequerimiento(index, { comentario: e.target.value })
                                    }
                                />

                                <TextAreaInput
                                    name={`recomendacion_${index}`}
                                    label="Recomendación"
                                    defaultValue={data.requerimientos[index]?.recomendacion || ""}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        updateRequerimiento(index, { recomendacion: e.target.value })
                                    }
                                />

                                <DropzoneComponent
                                    name={`archivos_${index}`}
                                    label="Archivos"
                                    defaultValue=""
                                    onDrop={(files: File[]) => {
                                        updateRequerimiento(index, { archivos: files[0] })
                                    }
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </Section>

                <Section title="Resumen Hábitos Operacionales">
                    <Label>Calificación</Label>
                    <Select
                        options={calificacionesResumenOptions}
                        placeholder="Selecciona una calificación"
                        value={data.calificacion_resumen}
                        onChange={(value: string) => updateData({ calificacion_resumen: value })}
                    />

                    <TextAreaInput
                        name="observaciones_habitos_operacionales"
                        label="Observaciones"
                        defaultValue={data.observaciones_resumen}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            updateData({ observaciones_resumen: e.target.value })
                        }
                    />
                </Section>
            </div>
        </div>
    );
}