"use client";

import React, { useEffect, useState } from "react";
import { Section } from "@/components/ui/section/section";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { getAuditores } from "@/lib/auditor";
import { getEmpresas } from "@/lib/empresas";
import DefaultInputs from "@/components/form/form-elements/DefaultInputs";
import Input from "@/components/form/input/InputField";
import { CalenderIcon } from "@/icons";

// Tipo local para los datos de este paso
export interface BaseInformeData {
  nombre_informe: string;
  fecha: string;
  auditor: string; // ID del auditor seleccionado
  empresa: string; // ID de la empresa seleccionada
}

// Props que el padre le pasa al componente
interface Props {
  data: BaseInformeData;
  onChange: (value: Partial<BaseInformeData>) => void;
}


export default function BaseInformeAcreditacionCompetencias({ data, onChange }: Props) {
  const [auditores, setAuditores] = useState<any[]>([]);
  const [empresas, setEmpresas] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resAuditores = await getAuditores();
        console.log(resAuditores)
        setAuditores(resAuditores);

        const resEmpresas = await getEmpresas();
        setEmpresas(resEmpresas);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    fetchData();
  }, []);

  const auditorOptions = auditores.map((auditor) => ({
    value: String(auditor.documentId),
    label: auditor.Nombre,
  }));

  const empresaOptions = empresas.map((empresa) => ({
    value: String(empresa.documentId),
    label: empresa.Nombre,
  }));

  return (
    <div id="form-acreditacion" className="p-6 space-y-10">
      <Section title="Base del Informe">
        {/* Nombre del informe */}
        <DefaultInputs
          name="nombre_informe"
          label="Nombre del Informe"
          defaultValue={data.nombre_informe || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ nombre_informe: e.target.value })
          }
        />

        {/* Fecha */}
        <div className="relative">
          <Label htmlFor="fecha">Fecha</Label>
          <div className="relative">
            <Input
              type="date"
              id="fecha"
              name="fecha"
              value={data.fecha || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange({ fecha: e.target.value })
              }
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <CalenderIcon />
            </span>
          </div>
        </div>

        {/* Selección de auditor */}
        <div>
          <Label>Seleccionar Auditor</Label>
          <Select
            options={auditorOptions}
            placeholder="Selecciona un auditor"
            value={data.auditor || ""}
            onChange={(value: string) => {
              console.log(value)
              onChange({ auditor: value })
            }
            }
          />
        </div>

        {/* Selección de empresa */}
        <div>
          <Label>Seleccionar Empresa</Label>
          <Select
            options={empresaOptions}
            placeholder="Selecciona una empresa"
            value={data.empresa || ""}
            onChange={(value: string) => onChange({ empresa: value })}
          />
        </div>
      </Section>
    </div>
  );
}
