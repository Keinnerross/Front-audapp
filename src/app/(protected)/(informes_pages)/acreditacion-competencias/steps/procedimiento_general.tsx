"use client";

import React, { useEffect, useState } from "react";
import { Section } from "@/components/ui/section/section";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import TextAreaInput from "@/components/form/form-elements/TextAreaInput";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import { getRequerimientosProcedimientoGeneral } from "@/lib/informe _acreditación";

export interface Requerimiento {
  nombre_requerimiento: string;
  calificacion: string;
  comentario: string;
  recomendacion: string;
  archivos: File | null;
}

export interface ProcedimientoGeneralData {
  requerimientos: Requerimiento[];
  calificacion_resumen: string;
  observaciones_resumen: string;
}

interface Props {
  data: ProcedimientoGeneralData;
  onChange: (value: Partial<ProcedimientoGeneralData>) => void;
}

export default function ProcedimientoGeneralAcreditacionCompetencias({
  data,
  onChange,
}: Props) {
  const calificaciones = ["cumple", "no cumple", "oportunidad de mejora", "no aplica"];
  const calificacionesResumen = ["conforme", "no conforme", "con observaciones", "no aplica"];
  const [requerimientosAPI, setRequerimientosAPI] = useState<any[]>([]);

  const calificacionesOptions = calificaciones.map((c) => ({ value: c, label: c }));
  const calificacionesResumenOptions = calificacionesResumen.map((c) => ({
    value: c,
    label: c,
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRequerimientosProcedimientoGeneral();
        setRequerimientosAPI(res);


      } catch (error) {
        console.error("Error cargando requerimientos:", error);
      }
    };

    fetchData();
  }, []);

  const updateRequerimiento = (index: number, newData: Partial<Requerimiento>) => {
    const updated = [...data.requerimientos];
    const current = updated[index] || {};
    updated[index] = {
      ...current,
      ...newData,
      nombre_requerimiento:
        requerimientosAPI[index]?.nombre_requerimiento || current.nombre_requerimiento || "",
    };
    onChange({ requerimientos: updated });
  };

  return (
    <div className="pb-10">
      <div id="form-procedimiento" className="p-6 space-y-10">
        <Section title="Procedimiento General">
          <div className="flex flex-col gap-14">
            {requerimientosAPI.map((requerimiento, index) => (
              <div key={index} className="flex flex-col gap-4 my-10">
                <Label className="text-base">
                  <span>{index + 1}) </span>
                  {requerimiento.nombre_requerimiento}
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
                  onChange={(e) =>
                    updateRequerimiento(index, { comentario: e.target.value })
                  }
                />

                <TextAreaInput
                  name={`recomendacion_${index}`}
                  label="Recomendación"
                  defaultValue={data.requerimientos[index]?.recomendacion || ""}
                  onChange={(e) =>
                    updateRequerimiento(index, { recomendacion: e.target.value })
                  }
                />

                <DropzoneComponent
                  name={`archivos_${index}`}
                  label="Evidencia"
                  defaultValue=""
                  onDrop={(files: File[]) =>
                    updateRequerimiento(index, { archivos: files[0] })
                  }
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Resumen procedimiento general">
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
            name="observaciones_procedimiento_general"
            label="Observaciones"
            defaultValue={data.observaciones_resumen}
            onChange={(e) =>
              onChange({ observaciones_resumen: e.target.value })
            }
          />
        </Section>
      </div>
    </div>
  );
}
