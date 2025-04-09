"use client";

import React, { useEffect, useState } from "react";
import { Section } from "@/components/ui/section/section";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import TextAreaInput from "@/components/form/form-elements/TextAreaInput";
import { getRequerimientosGestionDeControl } from "@/lib/informe _acreditación";

import DropzoneComponent from "@/components/form/form-elements/DropZone";

export default function GestionDeControlAcreditacionCompetencias() {
    const calificaciones = ["Cumple", "No Cumple", "Oportunidad de Mejora", "No Aplica"];
    const calificacionesResumen = ["Conforme", "No Conforme", "Con Observaciones", "No Aplica"];


    const [requerimientos, setRequerimientos] = useState([]);

    const calificacionesOptions = calificaciones.map((calificacion) => ({
        value: String(calificacion),
        label: calificacion,
    }));

    const calificacionesResumenOptions = calificacionesResumen.map((calificacion) => ({
        value: String(calificacion),
        label: calificacion,
    }));



    useEffect(() => {
        const fetchAuditores = async () => {
            try {
                const res = await getRequerimientosGestionDeControl();
                setRequerimientos(res);

            } catch (error) {
                console.error("Error cargando auditores:", error);
            }
        };

        fetchAuditores();
    }, []);






    return (
        <div className="pb-10">
            <div id="form-procedimiento" className="p-6 space-y-10">

                <Section title="Gestión de Control">
                    <div className="flex flex-col gap-14">
                        {requerimientos.map((requerimiento, index) => (
                            <div key={index} className="flex flex-col gap-4">
                                <Label className="text-base"><span>{index + 1}) </span>{requerimiento.nombre_requerimiento}</Label>
                                <div className="flex flex-col gap-4">

                                    <Select
                                        options={calificacionesOptions}
                                        placeholder="Selecciona una calificación"
                                        onChange={(value) => {
                                            const calificacion = calificaciones.find((a) => String(a) === value);
                                            console.log("Calificación:", calificacion);
                                        }}
                                    />

                                    <TextAreaInput
                                        name={`comentario_${index}`}
                                        label="Comentario"
                                        defaultValue=""
                                    />
                                    <TextAreaInput
                                        name={`recomendacion_${index}`}
                                        label="Recomendación"
                                        defaultValue=""
                                    />

                                    <DropzoneComponent
                                        name={`evidencia_${index}`}
                                        label="Evidencia"
                                        defaultValue=""
                                    />

                                </div>
                            </div>
                        ))}

                    </div>

                </Section>


                <Section title="Resumen Hábitos Operacionales">
                    <div className="">
                        <Label>Calificación</Label>
                        <Select
                            options={calificacionesResumenOptions}
                            placeholder="Selecciona una calificacion"
                            onChange={(value) => {
                                const calificacion = calificacionesResumen.find((a) => String(a) === value);

                                console.log("Calificacion:", calificacion);
                            }}
                        />
                    </div>
                    <TextAreaInput name="observaciones_procedimiento_general" label="Observaciones" defaultValue={""} />
                </Section>

            </div>

        </div >
    );
}
