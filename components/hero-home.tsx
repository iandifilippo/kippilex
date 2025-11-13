"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from 'next/link'; // 1. Importamos Link para la navegación

// (Las importaciones del video siguen comentadas)
// import VideoThumb from "@/public/images/hero-image-01.jpg";
// import ModalVideo from "@/components/modal-video";

export default function HeroHome() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Contenido principal */}
        <div className="py-12 md:py-20">
          {/* Encabezado */}
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
                
                {/* --- INICIO DE LA EDICIÓN DE BOTONES --- */}

                {/* Botón 1: "Comenzar ahora" -> /signup */}
                <div data-aos="fade-up" data-aos-delay={400}>
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 25px rgba(99,102,241,0.6)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0 }}
                  >
                    <Link
                      className="btn group mb-4 w-full bg-gradient-to-t from-indigo-600 to-indigo-500 text-white shadow-lg rounded-full sm:mb-0 sm:w-auto"
                      href="/signup" // 2. CORREGIDO: Apunta a /signup
                    >
                      <span className="relative inline-flex items-center">
                        Comenzar ahora
                        <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
                          →
                        </span>
                      </span>
                    </Link>
                  </motion.div>
                </div>
                
                {/* Botón 2: "Registrarse" -> "Ver Casos" -> /casos */}
                <div data-aos="fade-up" data-aos-delay={600}>
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 25px rgba(129,140,248,0.5)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0 }}
                  >
                    <Link
                      className="btn relative w-full bg-gradient-to-b from-gray-800 to-gray-700 text-gray-200 border border-gray-700 shadow-lg rounded-full sm:ml-4 sm:w-auto"
                      href="/casos" // 3. CORREGIDO: Apunta a /casos
                    >
                      Ver Casos {/* 4. CORREGIDO: Texto del botón */}
                    </Link>
                  </motion.div>
                </div>
                {/* --- FIN DE LA EDICIÓN DE BOTONES --- */}

              </div>
            </div>
          </div>

          {/* Imagen (sin cambios) */}
          <div
            className="relative flex justify-center items-center mb-16"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <Image
              src="/images/kippilex1-transparent.png"
              width={512} 
              height={288} 
              alt="Plataforma KippiLex"
              className="w-full h-auto max-w-md" 
              priority={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}