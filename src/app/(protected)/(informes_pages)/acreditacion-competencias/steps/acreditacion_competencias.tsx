// 🎯 Objetivo: que los cambios en cada operador actualicen correctamente el estado del padre (formulario general).

"use client";

import React, { useState } from "react";
import { Section } from "@/components/ui/section/section";
import AcreditacionCompetenciasComponent, { AcreditacionData } from "@/components/audapp/acreditacion-competencias/acreditacionCompetenciasComponent";
import Button from "@/components/ui/button/Button";
import { ChevronDownIcon, ChevronUpIcon } from "@/icons";

interface Props {
  data: {
    acreditacion_single: AcreditacionData[];
  };
  updateData: (value: { acreditacion_single: AcreditacionData[] }) => void;
}

export default function AcreditacionCompetenciasAcreditacionCompetencias({ data, updateData }: Props) {
  const [openIndexes, setOpenIndexes] = useState<number[]>(
    data.acreditacion_single.map((_, i) => i)
  );

  const toggleAccordion = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const addOperador = () => {
    const nuevoOperador: AcreditacionData = {
      nombre_operador: "",
      rut_operador: "",
      fecha_evaluacion: null,
      evaluacion_teorica: null,
      evaluacion_practica: null,
      evaluador: "",
      rut_evaluador: "",
      observaciones: "",
      scan_documento: [],
    };

    

    const actualizados = [...data.acreditacion_single, nuevoOperador];
    updateData({ acreditacion_single: actualizados });
    setOpenIndexes((prev) => [...prev, actualizados.length - 1]);
  };

  const removeOperador = (index: number) => {
    const nuevos = data.acreditacion_single.filter((_, i) => i !== index);
    updateData({ acreditacion_single: nuevos });
    setOpenIndexes((prev) => prev.filter((i) => i !== index));
  };

  const handleUpdateOperador = (index: number, value: Partial<AcreditacionData>) => {
    const actualizados = data.acreditacion_single.map((op, i) =>
      i === index ? { ...op, ...value } : op
    );
    updateData({ acreditacion_single: actualizados });
  };

  return (
    <div className="pb-10 min-h-[500px]">
      <Section title="Lista de operadores">
        <div className="flex flex-col gap-4">
          {data.acreditacion_single.map((operador, index) => {
            const isOpen = openIndexes.includes(index);
            return (
              <div key={index} className="relative rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="flex justify-between items-center px-4 bg-gray-50 border-b">
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="text-left w-full flex items-center h-12 justify-between gap-3 text-sm font-medium text-gray-700"
                  >
                    <span>Operador #{index + 1}</span>
                    {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  </button>
                  {data.acreditacion_single.length > 1 && (
                    <button
                      onClick={() => removeOperador(index)}
                      className="ml-4 text-red-500 hover:text-red-700 text-lg font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>
                {isOpen && (
                  <div className="p-4">
                    <AcreditacionCompetenciasComponent
                      data={operador}
                      updateData={(value) => handleUpdateOperador(index, value)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Button onClick={addOperador} className="mt-4">
          Añadir Operador
        </Button>
      </Section>
    </div>
  );
}
