"use client";

import React from "react";
import Label from "@/components/form/Label";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import Input from "@/components/form/input/InputField";
import { CalenderIcon } from "@/icons";
import DefaultInputs from "@/components/form/form-elements/DefaultInputs";
import { formatDate } from "@/utils/formatDate";
import { mejorarComentarioIA } from "@/lib/IA/gemini";
import TextAreaInputAI from "@/components/form/form-elements/TextAreaInputAI";

// 💡 Tipo para este paso del formulario
export interface AcreditacionData {
  nombre_operador: string;
  rut_operador: string;
  fecha_evaluacion: string | null;
  evaluacion_teorica: string | null;
  evaluacion_practica: string | null;
  evaluador: string;
  rut_evaluador: string;
  observaciones: string;
  scan_documento: File[] | null;
}

// Props esperados desde el componente padre
interface Props {
  empresaDocumentId: string;
  data: AcreditacionData;
  updateData: (value: Partial<AcreditacionData>) => void;
}


export default function AcreditacionCompetenciasComponent({ data, updateData, empresaDocumentId }: Props) {
  return (
    <div className="pb-10">
      <div className="flex flex-col gap-6">

        {/* Faltaria integrar la posibilidad de elegir el operador desde el back */}

        <DefaultInputs
          name="nombre_operador"
          label="Nombre operador"
          defaultValue={data.nombre_operador}
          onChange={(e) => updateData({ nombre_operador: e.target.value })}
        />
        <DefaultInputs
          name="rut_operador"
          label="Rut operador"
          defaultValue={data.rut_operador}
          onChange={(e) => updateData({ rut_operador: e.target.value })}
        />

        {/* Fecha Evaluación */}
        {/* <div className="relative">
          <Label htmlFor="fecha_evaluacion">Fecha Evaluación</Label>
          <div className="relative">
            <Input
              type="date"
              id="fecha_evaluacion"
              name="fecha_evaluacion"
              defaultValue={formatDate(data.fecha_evaluacion)}
              onChange={(e) =>
                updateData({ fecha_evaluacion: formatDate(e.target.value) })
              }
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
              <CalenderIcon />
            </span>
          </div>
        </div> */}

        {/* Evaluación Práctica */}
        <div className="relative">
          <Label htmlFor="evaluacion_practica">Evaluación Práctica</Label>
          <div className="relative">
            <Input
              type="date"
              id="evaluacion_practica"
              name="evaluacion_practica"
              defaultValue={formatDate(data.evaluacion_practica)}
              onChange={(e) =>
                updateData({ evaluacion_practica: formatDate(e.target.value) })
              }
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
              <CalenderIcon />
            </span>
          </div>
        </div>

        {/* Evaluación Teórica */}
        <div className="relative">
          <Label htmlFor="evaluacion_teorica">Evaluación Teórica</Label>
          <div className="relative">
            <Input
              type="date"
              id="evaluacion_teorica"
              name="evaluacion_teorica"
              defaultValue={formatDate(data.evaluacion_teorica)}
              onChange={(e) =>
                updateData({ evaluacion_teorica: formatDate(e.target.value) })
              }
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
              <CalenderIcon />
            </span>
          </div>
        </div>

        {/* Evaluador */}
        <DefaultInputs
          name="evaluador"
          label="Evaluador"
          defaultValue={data.evaluador}
          onChange={(e) => updateData({ evaluador: e.target.value })}
        />
        <DefaultInputs
          name="rut_evaluador"
          label="Rut Evaluador"
          defaultValue={data.rut_evaluador}
          onChange={(e) => updateData({ rut_evaluador: e.target.value })}
        />

        {/* Observaciones */}
        <TextAreaInputAI
          name="observaciones"
          label="Observaciones"
          value={data.observaciones || ''}
          onImprove={async (text) => {
            const textoMejorado: string = await mejorarComentarioIA(text)
            return textoMejorado;
          }}
          onChange={(e) => updateData({ observaciones: e.target.value })}
        />


        {/* Documentos */}
        <DropzoneComponent
          name="scan_documento"
          label="Scan Documento"
          defaultValue={data.scan_documento || []}
          onDrop={(files) => {
            updateData({ scan_documento: files });
          }}
        />
      </div>
    </div>
  );
}
