import Image from "next/image";
import BlurredShape from "@/public/images/blurred-shape.svg";

export default function Cta() {
  return (
    <section className="relative overflow-hidden">
      {/* --- CAMBIO 1: Opacidad del fondo --- */}
      {/* He añadido 'opacity-30' para que la silueta sea más sutil */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -mb-24 ml-20 -translate-x-1/2"
        aria-hidden="true"
      >
        <Image
          className="max-w-none opacity-30" // <--- CAMBIO AQUÍ
          src={BlurredShape}
          width={760}
          height={668}
          alt="Blurred shape"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-linear-to-r from-transparent via-gray-800/50 py-12 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            
            {/* --- CAMBIO 2: Texto (Sugerencia) --- */}
            <h2
              className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-8 font-nacelle text-3xl font-semibold text-transparent md:text-4xl"
              data-aos="fade-up"
            >
              ¿Necesitas un abogado?
            </h2>

            <p
              className="pb-8 text-lg text-indigo-200/65"
              data-aos="fade-up"
              data-aos-delay={200}
            >
              Describe tu situación y deja que los mejores especialistas te contacten con una propuesta.
            </p>
            {/* --- Fin del Cambio de Texto --- */}

            <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
              <div data-aos="fade-up" data-aos-delay={400}>
                <a
                  className="btn group mb-4 w-full bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto"
                  href="#0" 
                >
                  <span className="relative inline-flex items-center">
                    Registrar caso
                  </span>
                </a>
              </div>

              {/* --- CAMBIO 3: Botón "Fantasma" ELIMINADO --- */}
              {/* He eliminado todo el <div> que contenía el segundo botón 
                  (el que decía 'Schedule Demo'). 
                  Al eliminarlo, el 'justify-center' del div padre
                  centrará automáticamente el único botón que queda.
              */}
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}