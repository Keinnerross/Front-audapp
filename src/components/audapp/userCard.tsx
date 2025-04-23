"use client";
import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Image from "next/image";
import Link from "next/link";
import { getAuditor, Auditor, getAuditorPicture, AuditorPic } from "@/lib/user"
import { FaClipboardCheck, FaLock } from "react-icons/fa";
import LoadingOverlay from "../common/LoaderFullPage";



export default function UserCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [auditor, setAuditor] = useState<Auditor | null>(null);
  const [picture, setPicture] = useState<AuditorPic | null>(null);


  useEffect(() => {


    const fetchData = async () => {
      try {
        const userStorage = localStorage.getItem("user");
        if (userStorage) {
          const usernameParse = userStorage?.replace(/['"]+/g, '');
          const auditorData = await getAuditor(usernameParse);
          setAuditor(auditorData);
          const foto = await getAuditorPicture(usernameParse);
          setPicture(foto)


        } else {
          console.log("No se encontró el usuario en localStorage");
        }
      } catch (error) {
        console.error("Error al obtener los datos del auditor:", error);
      }
    };

    fetchData();


  }, [])




  return (
    <>

      <LoadingOverlay isWhite={true} isLoading={!picture} />

      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center  gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src={picture?.fotoUrl || "/images/user/owner.jpg"}
                // src="/images/user/owner.jpg"
                alt="user"
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
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
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

            {/* Opciones */}
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
