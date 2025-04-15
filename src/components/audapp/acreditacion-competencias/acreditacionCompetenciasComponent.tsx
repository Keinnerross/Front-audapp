"use client";

import React, { useEffect, useState } from "react";
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
  fecha_evaluacion: Date;
  evaluacion_teorica: Date;
  evaluacion_practica: Date;
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

export default function AcreditacionCompetenciasComponent({ data, updateData }: Props) {


  //En este componente creamos los operadores desde el front. luego de creados y asociados a la empresa auditada, los demás campos del informe son subidos junto con todo lo demás.
  return (
    <div className="pb-10">
      <div className="flex flex-col gap-6">
        <DefaultInputs
          name="Nombre operador"
          label="Nombre operador"
        />
        <DefaultInputs
          name="Rut Operador"
          label="Rut operador"
        />
        <div className="relative">
          <Label htmlFor="fecha_evaluacion">Fecha Evaluación</Label>
          <div className="relative">
            <Input
              type="date"
              id="fecha_evaluacion"
              name="fecha_evaluacion"
              defaultValue={data.fecha_evaluacion}
              onChange={(e) => updateData({ fecha_evaluacion: e.target.value })}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <CalenderIcon />
            </span>
          </div>
        </div>
        <div className="relative">
          <Label htmlFor="fecha_evaluacion">Evaluación Práctica</Label>
          <div className="relative">
            <Input
              type="date"
              id="evaluacion_practica"
              name="evaluacion_practica"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <CalenderIcon />
            </span>
          </div>
        </div>
        <div className="relative">
          <Label htmlFor="fecha_evaluacion">Evaluación Teórica</Label>
          <div className="relative">
            <Input
              type="date"
              id="evaluacion_teorica"
              name="evaluacion_teorica"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <CalenderIcon />
            </span>
          </div>
        </div>
        <DefaultInputs
          name="evaluador"
          label="Evaluador"
          defaultValue={data.evaluador}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateData({ evaluador: e.target.value })
          }
        />
        <DefaultInputs
          name="rut_evaluador"
          label="Rut Evaluador"
          defaultValue={data.rut_evaluador}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateData({ rut_evaluador: e.target.value })
          }
        />
        <TextAreaInput
          name="observaciones"
          label="Observaciones"
          defaultValue={data.observaciones}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            updateData({ observaciones: e.target.value })
          }
        />
        <DropzoneComponent
          name="scan_documento"
          label="Scan Documento"
          defaultValue={data.scan_documento || []}
          onDrop={(files: File[]) => {
            updateData({ scan_documento: files });
          }}
        />
      </div>
    </div>
  );
}
