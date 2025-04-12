"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import { getPDFUrlById } from "@/lib/common_informes";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function GeneratedPDF() {
    const { id } = useParams();
    const router = useRouter();
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchPDF = async () => {
            if (!id) return;
            const url = await getPDFUrlById(Number(id));
            setPdfUrl(url);
            setLoading(false);
        };

        fetchPDF();
    }, [id]);

    const copyToClipboard = () => {
        if (pdfUrl) {
            navigator.clipboard.writeText(pdfUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Descarga del informe" />

            <div className="space-y-8 mt-10">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm space-y-6">
                    <div className="text-center space-y-2">
                        <div className="text-4xl">📄</div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            PDF Generado Correctamente
                        </h3>
                        <p className="text-gray-500 text-sm">Tu informe ya está listo. Puedes descargarlo o compartir el enlace.</p>
                    </div>

                    {loading ? (
                        <p className="text-center text-gray-500">Cargando informe...</p>
                    ) : pdfUrl ? (
                        <div className="space-y-4">
                            <a
                                href={pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <div className="flex justify-center">
                                    <div className="w-[800px] ">
                                        <Button variant="primary" className="w-full flex items-center gap-2 justify-center">
                                            Ver Informe
                                        </Button>
                                    </div>
                                </div>


                            </a>

                            <div className="flex flex-col items-center gap-2">
                                {/* <code className="text-xs text-gray-400 break-all text-center">{pdfUrl}</code> */}

                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={copyToClipboard}
                                        className="text-sm px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition text-gray-700"
                                    >
                                        {copied ? "¡Copiado!" : "Copiar enlace"}
                                    </button>

                                    <button
                                        onClick={() => router.push("/dashboard")}
                                        className="text-sm px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition text-gray-700"
                                    >
                                        Volver al dashboard
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-red-500">❌ No se pudo cargar el enlace del PDF.</p>
                    )}
                </div>
            </div>

        </div>

    );
}
