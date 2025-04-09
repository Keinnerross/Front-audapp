"use client";

import React, { useEffect, useState } from "react";
import { Section } from "@/components/ui/section/section";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import TextAreaInput from "@/components/form/form-elements/TextAreaInput";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import { getRequerimientosHabilitacion } from "@/lib/informe _acreditación";

// Tipos
export interface HabilitacionRequerimiento {
  id: number;
  calificacion: string;
  comentario: string;
  recomendacion: string;
  evidencia: File | null;
}

export interface HabilitacionData {
  requerimientos: HabilitacionRequerimiento[];
  calificacion_resumen: string;
  observaciones_resumen: string;
}

interface Props {
  data: HabilitacionData;
  onChange: (value: Partial<HabilitacionData>) => void;
}

export default function HabilitacionAcreditacionCompetencias({ data, onChange }: Props) {
  const calificaciones = ["Cumple", "No Cumple", "Oportunidad de Mejora", "No Aplica"];
  const calificacionesResumen = ["Conforme", "No Conforme", "Con Observaciones", "No Aplica"];
  const [requerimientosAPI, setRequerimientosAPI] = useState<any[]>([]);

  const calificacionesOptions = calificaciones.map((c) => ({ value: c, label: c }));
  const calificacionesResumenOptions = calificacionesResumen.map((c) => ({ value: c, label: c }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRequerimientosHabilitacion();
        setRequerimientosAPI(res);

        if (data.requerimientos.length === 0) {
          const initial = res.map((r: any) => ({
            id: r.id,
            calificacion: "",
            comentario: "",
            recomendacion: "",
            evidencia: null,
          }));
          onChange({ requerimientos: initial });
        }
      } catch (error) {
        console.error("Error cargando requerimientos:", error);
      }
    };

    fetchData();
  }, []);

  const updateRequerimiento = (index: number, newData: Partial<HabilitacionRequerimiento>) => {
    const updated = [...data.requerimientos];
    updated[index] = { ...updated[index], ...newData };
    onChange({ requerimientos: updated });
  };

  return (
    <div className="pb-10">
      <div id="form-habilitacion" className="p-6 space-y-10">
        <Section title="Habilitación">
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
                  onChange={(value) =>
                    updateRequerimiento(index, { calificacion: value })
                  }
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
                  name={`evidencia_${index}`}
                  label="Evidencia"
                  defaultValue=""
                  onDrop={(files: File[]) =>
                    updateRequerimiento(index, { evidencia: files[0] })
                  }
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Resumen Habilitación">
          <Label>Calificación</Label>
          <Select
            options={calificacionesResumenOptions}
            placeholder="Selecciona una calificación"
            value={data.calificacion_resumen}
            onChange={(value: string) =>
              onChange({ calificacion_resumen: value })
            }
          />

          <TextAreaInput
            name="observaciones_habilitacion"
            label="Observaciones"
            defaultValue={data.observaciones_resumen}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              onChange({ observaciones_resumen: e.target.value })
            }
          />
        </Section>
      </div>
    </div>
  );
}
