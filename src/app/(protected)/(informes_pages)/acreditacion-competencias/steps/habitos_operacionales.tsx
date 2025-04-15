"use client";

import React, { useState } from "react";
import { Section } from "@/components/ui/section/section";
import AcreditacionCompetenciasComponent, { AcreditacionData } from "@/components/audapp/acreditacion-competencias/acreditacionCompetenciasComponent";
import Button from "@/components/ui/button/Button";
import { ChevronDownIcon, ChevronUpIcon } from "@/icons";

interface Props {
  data: AcreditacionData | AcreditacionData[];
  updateData: (index: number, value: Partial<AcreditacionData>) => void;
}

export default function HabitosAcreditacionCompetencias({ data, updateData }: Props) {
  const [operadores, setOperadores] = useState<AcreditacionData[]>(
    Array.isArray(data) ? data : [data]
  );

  const [openIndexes, setOpenIndexes] = useState<number[]>(
    Array.isArray(data) ? data.map((_, i) => i) : [0]
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
      fecha_evaluacion: new Date(),
      evaluacion_teorica: new Date(),
      evaluacion_practica: new Date(),
      evaluador: "",
      rut_evaluador: "",
      observaciones: "",
      scan_documento: [],
    };
    const newIndex = operadores.length;
    setOperadores([...operadores, nuevoOperador]);
    setOpenIndexes((prev) => [...prev, newIndex]);
  };

  const removeOperador = (index: number) => {
    const nuevos = operadores.filter((_, i) => i !== index);
    setOperadores(nuevos);
    setOpenIndexes((prev) => prev.filter((i) => i !== index));
  };

  const handleUpdateOperador = (index: number, value: Partial<AcreditacionData>) => {
    const updatedOperadores = operadores.map((op, idx) =>
      idx === index ? { ...op, ...value } : op
    );
    setOperadores(updatedOperadores);
    updateData(index, value);
  };

  return (
    <div className="pb-10">
      <Section title="Lista de operadores">
        <div className="flex flex-col gap-4">
          {operadores.map((operador, index) => {
            const isOpen = openIndexes.includes(index);

            return (
              <div
                key={index}
                className="relative rounded-xl border border-gray-200  bg-white dark:border-gray-800 dark:bg-slate-800 shadow-sm overflow-hidden"
              >
                <div className="flex justify-between items-center px-4  bg-gray-50 dark:bg-slate-700 border-b dark:border-gray-600">
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="text-left w-full flex items-center h-12 justify-between gap-3 text-sm font-medium text-gray-700 dark:text-white"
                  >
                    <span>Operador #{index + 1}</span>
                    {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  </button>

                  {operadores.length > 1 && (
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