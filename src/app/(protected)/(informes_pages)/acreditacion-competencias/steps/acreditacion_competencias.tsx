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

export default function AcreditacionCompetenciasAcreditacionCompetencias() {
    const [auditores, setAuditores] = useState([]);


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
        value: String(auditor.id),
        label: auditor.Nombre,
    }));



    return (
        <div className="pb-10">

            <Section title="Acreditación de competencias">
                <div className="flex flex-col gap-6">


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

                    <div className="relative">
                        <div>
                            <Label htmlFor="fecha_evaluacion">Fecha Evaluación</Label>
                            <div className="relative">
                                <Input
                                    type="date"
                                    id="fecha_evaluacion"
                                    name="fecha_evaluacion"
                                    onChange={(e) => console.log(e.target.value)}
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                    <CalenderIcon />
                                </span>
                            </div>
                        </div>

                    </div>
                    <DefaultInputs name="nombre_informe" label="Evaluación teórica" defaultValue={""} />
                    <DefaultInputs name="nombre_informe" label="Evaluación práctica" defaultValue={""} />
                    <DefaultInputs name="nombre_informe" label="Evaluador" defaultValue={""} />
                    <DefaultInputs name="nombre_informe" label="Rut Evaluador" defaultValue={""} />
                    <TextAreaInput
                        name={`observaciones_0`}
                        label="Observaciones"
                        defaultValue=""
                    />
                    <DropzoneComponent
                        name={`evidencia_0}`}
                        label="Evidencia"
                        defaultValue=""
                    />
                </div>

            </Section>




        </div >
    );
}
