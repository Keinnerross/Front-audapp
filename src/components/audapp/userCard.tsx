"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ para redireccionar
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Image from "next/image";
import Link from "next/link";
import { getAuditor, Auditor, getAuditorPicture, AuditorPic } from "@/lib/user";
import { FaClipboardCheck, FaLock } from "react-icons/fa";
import LoadingOverlay from "../common/LoaderFullPage";

export default function UserCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [auditor, setAuditor] = useState<Auditor | null>(null);
  const [picture, setPicture] = useState<AuditorPic | null>(null);
  const [loading, setLoading] = useState(true); // ✅ estado de carga

  const router = useRouter(); // ✅ acceso a navegación

  const handleRedirect = () => {

    router.push("/signin"); // 🔁 redirección a login
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStorage = localStorage.getItem("user");

        if (!userStorage) {
          console.warn("🕳 No se encontró el usuario en localStorage");
          handleRedirect();
          return;
        }

        const usernameParse = userStorage.replace(/['"]+/g, "").trim();

        if (!usernameParse || usernameParse.length < 3) {
          console.warn("🧼 Username inválido, limpiando storage...");
          localStorage.removeItem("user");
          handleRedirect();
          return;
        }

        const auditorData = await getAuditor(usernameParse);
        if (!auditorData) {
          console.warn("🔍 No se encontró auditor, limpiando localStorage...");
          localStorage.removeItem("user");
          handleRedirect();
          return;
        }

        setAuditor(auditorData);

        const foto = await getAuditorPicture(usernameParse);
        if (foto) {
          setPicture(foto);
          handleLoadingDelay(true); // ✅ activa el delay de carga
        } else {
          console.warn("⚠️ No se encontró una imagen para el auditor");
          handleLoadingDelay(false); // ❌ o forzar loading si quieres mantenerlo
        }
      } catch (error) {
        console.error("❌ Error fatal al obtener el auditor:", error);
        localStorage.removeItem("user");
        handleRedirect();
      }
    };

    fetchData();
  }, [router]);



  const handleLoadingDelay = (hasPicture: boolean) => {
    if (!hasPicture) return setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1500); // 🕓 delay suave
  };









  return (
    <>
      <LoadingOverlay isWhite={true} isLoading={loading} />

      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src={picture?.fotoUrl || "/images/user/owner.jpg"}
                alt="user"
                priority
              />
            </div>
            <div className="order-3 xl:order-2 flex flex-col items-center">
              <h4 className="text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {auditor?.nombre || ""}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {auditor?.cargo || ""}
              </p>
            </div>
          </div>
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-4 py-3 text-sm font-medium text-white shadow-theme-xs lg:inline-flex lg:w-auto"
          >
            <FaClipboardCheck className="text-xl text-white" />
            <p>Generar Informe</p>
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md w-full mx-4">
        <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-xl">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                Seleccione el tipo de auditoría
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Elige una opción para comenzar tu informe.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Link
                href="/acreditacion-competencias"
                className="flex items-center gap-3 rounded-xl border border-brand-100 bg-brand-50 px-4 py-4 text-brand-700 hover:bg-brand-100 transition dark:border-brand-900 dark:bg-brand-950 dark:text-brand-300"
              >
                <FaClipboardCheck className="text-xl text-brand-600" />
                <span className="font-medium text-base">Acreditación de competencias</span>
              </Link>

              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-400 dark:border-gray-700 dark:bg-gray-800"
                >
                  <FaLock className="text-xl" />
                  <span className="font-medium text-base">Próximamente</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
