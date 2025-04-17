"use client";

import React from "react";
import { Section } from "@/components/ui/section/section";
import Label from "@/components/form/Label";
import TextAreaInput from "@/components/form/form-elements/TextAreaInput";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import Input from "@/components/form/input/InputField";
import { CalenderIcon } from "@/icons";
import DefaultInputs from "@/components/form/form-elements/DefaultInputs";

// 💡 Tipo para este paso del formulario
export interface AcreditacionData {
  nombre_operador: string;
  rut_operador: string;
  fecha_evaluacion: Date | null;
  evaluacion_teorica: Date | null;
  evaluacion_practica: Date | null;
  evaluador: string;
  rut_evaluador: string;
  observaciones: string;
  scan_documento: File[] | null;
}

// Props esperados desde el componente padre
interface Props {
  data: AcreditacionData;
  updateData: (value: Partial<AcreditacionData>) => void;
}

// 🧠 Utilidad para formatear fecha sin errores
const formatDate = (date: Date | string | null | undefined) => {
  if (!date) return "";
  const d = new Date(date);
  return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
};

export default function AcreditacionCompetenciasComponent({ data, updateData }: Props) {
  return (
    <div className="pb-10">
      <div className="flex flex-col gap-6">
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
        <div className="relative">
          <Label htmlFor="fecha_evaluacion">Fecha Evaluación</Label>
          <div className="relative">
            <Input
              type="date"
              id="fecha_evaluacion"
              name="fecha_evaluacion"
              defaultValue={formatDate(data.fecha_evaluacion)}
              onChange={(e) =>
                updateData({ fecha_evaluacion: new Date(e.target.value) })
              }
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
              <CalenderIcon />
            </span>
          </div>
        </div>

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
                updateData({ evaluacion_practica: new Date(e.target.value) })
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
                updateData({ evaluacion_teorica: new Date(e.target.value) })
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
        <TextAreaInput
          name="observaciones"
          label="Observaciones"
          defaultValue={data.observaciones}
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
