"use client";

import React from "react";
import { Section } from "@/components/ui/section/section";
import Label from "@/components/form/Label";
import TextAreaInput from "@/components/form/form-elements/TextAreaInput";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import Input from "@/components/form/input/InputField";
import { CalenderIcon } from "@/icons";
import DefaultInputs from "@/components/form/form-elements/DefaultInputs";
import TextAreaInputAI from "@/components/form/form-elements/TextAreaInputAI";
import { mejorarComentarioIA } from "@/lib/IA/gemini";

// 💡 Tipo para este paso del formulario
export interface HabitosData {
    nombre_operador: string;
    rut_operador: string;
    fecha_acreditacion: Date | null;
    fecha_vigencia_licencia_interna: Date | null;
    resultado: string;
    habitos_operacionales_realizados: string;
    situacion_actual: string;
    conclusion_recomendacion: string;
}

interface Props {
    data: HabitosData;
    updateData: (value: Partial<HabitosData>) => void;
}

const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
};

export default function HabitosOperacionalesComponent({ data, updateData }: Props) {
    return (
        <div className="pb-10">
            <div className="flex flex-col gap-6">

                <DefaultInputs
                    name="nombre_operador"
                    label="Nombre operador"
                    defaultValue={data.nombre_operador}
                    onChange={(e) => {

                        updateData({ nombre_operador: e.target.value })

                    }}
                />

                <DefaultInputs
                    name="rut_operador"
                    label="Rut operador"
                    defaultValue={data.rut_operador}
                    onChange={(e) => updateData({ rut_operador: e.target.value })}
                />

                {/* Fecha Acreditación */}
                <div className="relative">
                    <Label htmlFor="fecha_acreditacion">Fecha Acreditación</Label>
                    <div className="relative">
                        <Input
                            type="date"
                            id="fecha_acreditacion"
                            name="fecha_acreditacion"
                            value={formatDate(data.fecha_acreditacion)}
                            onChange={(e) => updateData({ fecha_acreditacion: new Date(e.target.value) })}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                            <CalenderIcon />
                        </span>
                    </div>
                </div>

                {/* Fecha Vigencia Licencia Interna */}
                <div className="relative">
                    <Label htmlFor="fecha_vigencia_licencia_interna">Fecha Vigencia Licencia Interna</Label>
                    <div className="relative">
                        <Input
                            type="date"
                            id="fecha_vigencia_licencia_interna"
                            name="fecha_vigencia_licencia_interna"
                            value={formatDate(data.fecha_vigencia_licencia_interna)}
                            onChange={(e) => updateData({ fecha_vigencia_licencia_interna: new Date(e.target.value) })}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                            <CalenderIcon />
                        </span>
                    </div>
                </div>

                {/* TextAreas IA */}
                <TextAreaInputAI
                    name="resultado"
                    label="Resultado"
                    value={data.resultado}
                    onChange={(e) => updateData({ resultado: e.target.value })}
                    onImprove={async (text) => {
                        const textoMejorado: string = await mejorarComentarioIA(text);
                        return textoMejorado;
                    }}
                />

                <TextAreaInputAI
                    name="habitos_operacionales_realizados"
                    label="Hábitos operacionales realizados"
                    value={data.habitos_operacionales_realizados}
                    onChange={(e) => updateData({ habitos_operacionales_realizados: e.target.value })}
                    onImprove={async (text) => {
                        const textoMejorado: string = await mejorarComentarioIA(text);
                        return textoMejorado;
                    }}
                />

                <TextAreaInputAI
                    name="situacion_actual"
                    label="Situación actual"
                    value={data.situacion_actual}
                    onChange={(e) => updateData({ situacion_actual: e.target.value })}
                    onImprove={async (text) => {
                        const textoMejorado: string = await mejorarComentarioIA(text);
                        return textoMejorado;
                    }}
                />

                <TextAreaInputAI
                    name="conclusion_recomendacion"
                    label="Conclusión / Recomendación"
                    value={data.conclusion_recomendacion}
                    onChange={(e) => updateData({ conclusion_recomendacion: e.target.value })}
                    onImprove={async (text) => {
                        const textoMejorado: string = await mejorarComentarioIA(text);
                        return textoMejorado;
                    }}
                />
            </div>
        </div>
    );
}
