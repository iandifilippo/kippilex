// RUTA: app/components/ui/hero-home.tsx (CORREGIDO)

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from 'next/link';

export default function HeroHome() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          
          {/* Encabezado */}
          <div className="pb-12 text-center md:pb-20">
            <h1
              // CORRECCIÓN 1 & 2: animate-[...] -> animate-gradient & bg-[length:200%_auto] -> bg-size-[200%_auto]
              className="animate-gradient bg-[linear-gradient(to_right,var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300))] bg-size-[200%_auto] bg-clip-text pb-5 font-nacelle text-4xl font-semibold text-transparent md:text-5xl"
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
                
                
                {/* Botón 1: "Comenzar ahora" -> /signup */}
                <div data-aos="fade-up" data-aos-delay={400}>
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      // Sombra eliminada
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      // CORRECCIÓN 3: bg-gradient-to-t -> bg-linear-to-t
                      className="group mb-4 w-full inline-block bg-linear-to-t from-indigo-600 to-indigo-500 text-white shadow-lg rounded-full sm:mb-0 sm:w-auto outline-none"
                      href="/signup"
                    >
                      <span className="relative inline-flex items-center px-4 py-2">
                        Comenzar ahora
                        <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
                          →
                        </span>
                      </span>
                    </Link>
                  </motion.div>
                </div>
                
                {/* Botón 2: "Ver Casos" -> /casos */}
                <div data-aos="fade-up" data-aos-delay={600}>
                  <motion.div
                    whileHover={{ 
                      scale: 1.05,
                      // Sombra eliminada
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      className="relative w-full inline-block bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 shadow-lg rounded-full sm:ml-4 sm:w-auto outline-none"
                      href="/casos"
                    >
                      <span className="relative inline-flex items-center px-4 py-2">
                        Ver Casos
                      </span>
                    </Link>
                  </motion.div>
                </div>
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