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


export default function BaseInformeAcreditacionCompetencias() {
    const [auditores, setAuditores] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    // Es necesario una estado para almacenar la data.

    useEffect(() => {
        const fetchAuditores = async () => {
            try {
                const resAuditores = await getAuditores();
                setAuditores(resAuditores);

                const resEmpresas = await getEmpresas();
                setEmpresas(resEmpresas);


            } catch (error) {
                console.error("Error cargando auditores:", error);
            }
        };

        fetchAuditores();
    }, []);

    const auditorOptions = auditores.map((auditor) => ({
        value: String(auditor.id),
        label: auditor.Nombre,
    }));

    const empresaOptions = empresas.map((empresa) => ({
        value: String(empresa.id),
        label: empresa.Nombre,
    }));

    return (
        <div>
            <div id="form-acreditacion" className="p-6 space-y-10">
                <Section title="Base del Informe">
                    <div>
                        <DefaultInputs name="nombre_informe" label="Nombre del Informe" defaultValue={""} />
                    </div>

                    <div className="relative">
                        <div>
                            <Label htmlFor="datePicker">Date Picker Input</Label>
                            <div className="relative">
                                <Input
                                    type="date"
                                    id="datePicker"
                                    name="datePicker"
                                    onChange={(e) => console.log(e.target.value)}
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                    <CalenderIcon />
                                </span>
                            </div>
                        </div>

                    </div>

                    <div className="">
                        <Label>Seleccionar Auditor</Label>
                        <Select
                            options={auditorOptions}
                            placeholder="Selecciona un auditor"
                            onChange={(value) => {
                                const auditor = auditores.find((a) => String(a.id) === value);
                                console.log("Auditor seleccionado:", auditor);
                            }}
                        />
                    </div>

                    <div className="">
                        <Label>Seleccionar Empresa</Label>
                        <Select
                            options={empresaOptions}
                            placeholder="Selecciona una empresa"
                            onChange={(value) => {
                                const empresa = empresas.find((a) => String(a.id) === value);
                                console.log("Empresa seleccionada:", empresa);
                            }}
                        />
                    </div>
                </Section>





            </div>
        </div>
    );
}
