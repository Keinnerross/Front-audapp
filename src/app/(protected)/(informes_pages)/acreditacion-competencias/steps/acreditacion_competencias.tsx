"use client";

import React, { useEffect, useState } from "react";
import { Section } from "@/components/ui/section/section";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import TextAreaInput from "@/components/form/form-elements/TextAreaInput";
import { getAuditores } from "@/lib/auditor";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import Input from "@/components/form/input/InputField";
import { CalenderIcon } from "@/icons";
import DefaultInputs from "@/components/form/form-elements/DefaultInputs";

// 💡 Tipo para este paso del formulario
export interface AcreditacionData {
  auditor: string;
  fecha_evaluacion: string;
  evaluacion_teorica: string;
  evaluacion_practica: string;
  evaluador: string;
  rut_evaluador: string;
  observaciones: string;
  scan_documento: File | string | null;
}

// Props esperados desde el componente padre
interface Props {
  data: AcreditacionData;
  updateData: (value: Partial<AcreditacionData>) => void;
}

export default function AcreditacionCompetenciasAcreditacionCompetencias({ data, updateData }: Props) {
  const [auditores, setAuditores] = useState<any[]>([]);

  useEffect(() => {
    const fetchAuditores = async () => {
      try {
        const resAuditores = await getAuditores();
        setAuditores(resAuditores);
      } catch (error) {
        console.error("Error cargando auditores:", error);
      }
    };

    fetchAuditores();
  }, []);

  const auditorOptions = auditores.map((auditor) => ({
    value: String(auditor.documentId),
    label: auditor.Nombre,
  }));

  return (
    <div className="pb-10">
      <Section title="Acreditación de competencias">
        <div className="flex flex-col gap-6">

          <div>
            <Label>Seleccionar Auditor</Label>
            <Select
              options={auditorOptions}
              placeholder="Selecciona un auditor"
              value={data.auditor}
              onChange={(value: string) => updateData({ auditor: value })}
            />
          </div>

          <div className="relative">
            <Label htmlFor="fecha_evaluacion">Fecha Evaluación</Label>
            <div className="relative">
              <Input
                type="date"
                id="fecha_evaluacion"
                name="fecha_evaluacion"
                value={data.fecha_evaluacion}
                onChange={(e) => updateData({ fecha_evaluacion: e.target.value })}
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <CalenderIcon />
              </span>
            </div>
          </div>

          <DefaultInputs
            name="evaluacion_teorica"
            label="Evaluación teórica"
            defaultValue={data.evaluacion_teorica}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateData({ evaluacion_teorica: e.target.value })
            }
          />

          <DefaultInputs
            name="evaluacion_practica"
            label="Evaluación práctica"
            defaultValue={data.evaluacion_practica}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateData({ evaluacion_practica: e.target.value })
            }
          />

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
            onDrop={(files: File[]) => {
              if (files.length > 0) {
                updateData({ scan_documento: files[0] });
              }
            }}
          />


        </div>
      </Section>
    </div>
  );
}
