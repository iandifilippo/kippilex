"use client";

import { motion } from "framer-motion";
import Image from "next/image"; // 1. Mantenemos la importación de 'Image'

// (Las importaciones del video siguen comentadas)
// import VideoThumb from "@/public/images/hero-image-01.jpg";
// import ModalVideo from "@/components/modal-video";

export default function HeroHome() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Contenido principal */}
        <div className="py-12 md:py-20">
          {/* Encabezado (esto sigue igual) */}
          <div className="pb-12 text-center md:pb-20">
            <h1
              className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300))] bg-[length:200%_auto] bg-clip-text pb-5 font-nacelle text-4xl font-semibold text-transparent md:text-5xl"
              data-aos="fade-up"
            >
              Tu aliado legal inteligente
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-xl text-indigo-200/65 leading-relaxed"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                KippiLex utiliza inteligencia artificial para comprender tu caso,
                encontrar al abogado ideal y simplificar tu proceso legal con
                transparencia, rapidez y confianza.
              </p>
              <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
                {/* Botones (esto sigue igual) */}
                <div data-aos="fade-up" data-aos-delay={400}>
                  <motion.a
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 25px rgba(99,102,241,0.6)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0 }}
                    className="btn group mb-4 w-full bg-gradient-to-t from-indigo-600 to-indigo-500 text-white shadow-lg rounded-full sm:mb-0 sm:w-auto"
                    href="#contacto"
                  >
                    <span className="relative inline-flex items-center">
                      Comenzar ahora
                      <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </span>
                  </motion.a>
                </div>
                <div data-aos="fade-up" data-aos-delay={600}>
                  <motion.a
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 25px rgba(129,140,248,0.5)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0 }}
                    className="btn relative w-full bg-gradient-to-b from-gray-800 to-gray-700 text-gray-200 border border-gray-700 shadow-lg rounded-full sm:ml-4 sm:w-auto"
                    href="#registro"
                  >
                    Registrarse
                  </motion.a>
                </div>
              </div>
            </div>
          </div>

          {/* --- INICIO DE LA EDICIÓN DE TAMAÑO --- */}
          <div
            className="relative flex justify-center items-center mb-16"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <Image
              src="/images/kippilex1-transparent.png"
              
              // --- CAMBIO 1: 'width' reducido ---
              // (Mantenemos la proporción 16:9)
              width={512} 
              
              // --- CAMBIO 2: 'height' reducido ---
              height={288} 

              alt="Plataforma KippiLex"

              // --- CAMBIO 3: 'max-w' reducido ---
              // Cambiamos de 'max-w-xl' (768px) a 'max-w-md' (512px)
              className="w-full h-auto max-w-md" 
              
              priority={true}
            />
          </div>
          {/* --- FIN DE LA EDICIÓN --- */}
        </div>
      </div>
    </section>
  );
}