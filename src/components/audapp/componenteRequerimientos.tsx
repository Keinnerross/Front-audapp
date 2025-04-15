"use client";

import React, { useEffect, useState } from "react";
import { Section } from "@/components/ui/section/section";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import TextAreaInput from "@/components/form/form-elements/TextAreaInput";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import TextAreaInputAI from "../form/form-elements/TextAreaInputAI";
import { mejorarComentarioIA } from "@/lib/IA/gemini";

// Tipos
export interface ComponenteRequerimiento {
    nombre_requerimiento: string;
    calificacion: string | null;
    comentario: string;
    recomendacion: string;
    archivos: File[] | null;
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

    const mainFetch = async () => {
        try {
            const res = await fetchRequerimientos();
            setRequerimientosAPI(res);
        } catch (error) {
            alert("Error al cargar los requerimientos iniciales: ");
            console.error(error);
        }
    }

    useEffect(() => {
        mainFetch();
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
                                    defaultValue={data.requerimientos[index]?.calificacion || ""}
                                    required={true}
                                    onChange={(value) => updateRequerimiento(index, { calificacion: value })}
                                />

                                <TextAreaInputAI
                                    name={`comentario_${index}`}
                                    label="Comentario"
                                    value={data.requerimientos[index]?.comentario ?? ""}
                                    onImprove={async (text) => {
                                        const textoMejorado: string = await mejorarComentarioIA(text)
                                        return textoMejorado;
                                    }}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        updateRequerimiento(index, { comentario: e.target.value })
                                    }
                                />

                                <TextAreaInputAI
                                    name={`recomendacion_${index}`}
                                    label="Recomendación"
                                    value={data.requerimientos[index]?.recomendacion ?? ""}
                                    onImprove={async (text) => {
                                        const textoMejorado: string = await mejorarComentarioIA(text)
                                        return textoMejorado;
                                    }}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        updateRequerimiento(index, { recomendacion: e.target.value })
                                    }
                                />

                                <DropzoneComponent
                                    name={`archivos_${index}`}
                                    label="Archivos"
                                    defaultValue={data.requerimientos[index]?.archivos || []}
                                    onDrop={(files: File[]) => {
                                        updateRequerimiento(index, { archivos: files })
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
                        defaultValue={data.calificacion_resumen}
                        onChange={(value: string) => updateData({ calificacion_resumen: value })}
                    />

                    <TextAreaInputAI
                        name="observaciones_habitos_operacionales"
                        label="Observaciones"
                        value={data.observaciones_resumen ? data.observaciones_resumen : ''}
                        onImprove={async (text) => {
                            const textoMejorado: string = await mejorarComentarioIA(text)
                            return textoMejorado;
                        }}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            updateData({ observaciones_resumen: e.target.value })
                        }
                    />
                </Section>
            </div>
        </div>
    );
}