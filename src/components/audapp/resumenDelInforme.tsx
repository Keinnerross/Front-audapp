"use client";

import React from "react";
import { Section } from "@/components/ui/section/section";
import TextAreaInputAI from "../form/form-elements/TextAreaInputAI";
import { mejorarComentarioIALargo } from "@/lib/IA/gemini";

// Tipo local para los datos de este paso
export interface ResumenFinal {
    resumen_final: string;

}

// Props que el padre le pasa al componente
interface Props {
    data: ResumenFinal;
    updateData: (value: Partial<ResumenFinal>) => void;
}


export default function ResumenDelInforme({ data, updateData }: Props) {
    return (
        <div>
            <Section title="Resumen general de la auditoría">
                <TextAreaInputAI
                    name={`resumen_final}`}
                    label="Descripcion del resumen"
                    value={data.resumen_final ?? ""}
                    onImprove={async (text) => {
                        const textoMejorado: string = await mejorarComentarioIALargo(text)
                        return textoMejorado;
                    }}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        updateData({ resumen_final: e.target.value })
                    }
                />
            </Section>
        </div>
    );
}
