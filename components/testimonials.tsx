"use client";

import { useState } from "react";
import useMasonry from "@/utils/useMasonry";
import Image, { StaticImageData } from "next/image";
import TestimonialImg01 from "@/public/images/testimonial-01.jpg";
import TestimonialImg02 from "@/public/images/testimonial-02.jpg";
import TestimonialImg03 from "@/public/images/testimonial-03.jpg";
import TestimonialImg04 from "@/public/images/testimonial-04.jpg";
import TestimonialImg05 from "@/public/images/testimonial-05.jpg";
import TestimonialImg06 from "@/public/images/testimonial-06.jpg";
import TestimonialImg07 from "@/public/images/testimonial-07.jpg";
import TestimonialImg08 from "@/public/images/testimonial-08.jpg";
import TestimonialImg09 from "@/public/images/testimonial-09.jpg";

const testimonios = [
  {
    img: TestimonialImg01,
    name: "CamilaRestrepo",
    especialidad: "Derecho Público",
    subespecialidad: "Derecho Constitucional",
    content:
      "He representado a entidades estatales en procesos de contratación y licitaciones. Gracias a KippiLex, facilito la conexión con clientes que buscan transparencia y eficacia en sus trámites administrativos.",
    categories: [1],
  },
  {
    img: TestimonialImg02,
    name: "Juan Rojas",
    especialidad: "Derecho Privado",
    subespecialidad: "Contratos",
    content:
      "Mi práctica se centra en contratos civiles y comerciales. Gracias a KippiLex, asesoro a personas que necesitan redactar o revisar acuerdos con seguridad jurídica.",
    categories: [2],
  },
  {
    img: TestimonialImg03,
    name: "Andrea Salazar",
    especialidad: "Derecho Penal",
    subespecialidad: "Derecho Penal Económico",
    content:
      "He trabajado en casos de defensa penal y litigios complejos. La plataforma me permite ofrecer acompañamiento inmediato a personas que enfrentan procesos judiciales delicados.",
    categories: [3],
  },
  {
    img: TestimonialImg04,
    name: "Mariana Duarte",
    especialidad: "Derecho Laboral",
    subespecialidad: "Derecho Individual del Trabajo",
    content:
      "Ayudo a trabajadores y empleadores a resolver conflictos laborales y reclamaciones pensionales. KippiLex ha agilizado el contacto directo con mis clientes.",
    categories: [4],
  },
  {
    img: TestimonialImg05,
    name: "Juliana Torres",
    especialidad: "Derecho Público",
    subespecialidad: "Derecho Administrativo",
    content:
      "Brindo asesoría a startups y pymes en temas contractuales, societarios y tributarios. En KippiLex, la IA entiende el contexto empresarial y filtra los casos que realmente encajan con mi perfil.",
    categories: [1],
  },
  {
    img: TestimonialImg06,
    name: "Laura Mendoza",
    especialidad: "Derecho Privado",
    subespecialidad: "Responsabilidad Civil",
    content:
      "Trabajo con clientes en asuntos migratorios y de comercio internacional. KippiLex permite conectar casos que cruzan fronteras sin complicaciones.",
    categories: [2],
  },
  {
    img: TestimonialImg07,
    name: "Santiago Rivera",
    especialidad: "Derecho Penal",
    subespecialidad: "Criminología y Política Criminal",
    content:
      "Mi enfoque está en la estrategia procesal y la representación en audiencias. KippiLex me permite recibir casos bien documentados y listos para su trámite.",
    categories: [3],
  },
  {
    img: TestimonialImg08,
    name: "Juliana Pérez",
    especialidad: "Derecho Laboral",
    subespecialidad: "Derecho de la Seguridad Social",
    content:
      "Me dedico a casos de familia y protección de derechos de menores. KippiLex me ha ayudado a llegar a personas que realmente necesitan asesoría humanizada.",
    categories: [4],
  },
  {
    img: TestimonialImg09,
    name: "Valentina Acosta",
    especialidad: "Derecho Público",
    subespecialidad: "Derecho Ambiental Público",
    content:
      "He asesorado empresas y comunidades en temas ambientales y de sostenibilidad. KippiLex facilita que las consultas lleguen sin intermediarios y con trazabilidad completa.",
    categories: [1],
  },
];

export default function AbogadosEspecialistas() {
  const masonryContainer = useMasonry();
  const [categoria, setCategoria] = useState<number>(0); // 0 es "Mostrar Todos"

  // --- CAMBIO 1: Revertido ---
  // Volvemos a poner "Derecho Penal" en una sola línea.
  const categorias = [
    "Mostrar Todos",
    "Derecho Público",
    "Derecho Privado",
    "Derecho Penal", // <--- SIN '\n'
    "Derecho Laboral",
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Línea de borde corregida */}
      <div className="border-t border-gray-800 py-12 md:py-20">
        {/* Encabezado */}
        <div className="mx-auto max-w-3xl pb-12 text-center">
          <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
            Nuestros Abogados Especialistas
          </h2>
          <p className="text-lg text-indigo-200/65">
            Conocé las especialidades y casos de nuestros abogados, todos
            verificados para tu tranquilidad.
          </p>
        </div>

        {/* Botones de categorías */}
        <div className="flex justify-center pb-12 md:pb-16">
          <div className="relative inline-flex flex-wrap justify-center rounded-[1.25rem] bg-gray-800/40 p-1">
            {categorias.map((categoriaText, i) => (
              <button
                key={i}
                // Mantenemos min-h-10 para que el botón pueda crecer
                className={`flex min-h-10 flex-1 items-center gap-2.5 rounded-full px-3 text-sm font-medium transition-colors ${
                  categoria === i
                    ? "relative bg-linear-to-b from-gray-900 via-gray-800/60 to-gray-900 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,--theme(--color-indigo-500/0),--theme(--color-indigo-500/.5))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear_gradient(white_0_0)]"
                    : "opacity-65 transition-opacity hover:opacity-90"
                }`}
                aria-pressed={categoria === i}
                onClick={() => setCategoria(i)}
              >
                {/* --- CAMBIO 2: El truco CSS 'max-w-' --- */}
                {/* Quitamos 'whitespace-pre-line' y añadimos 'max-w-[85px]'.
                  Esto fuerza a que el texto no pueda ocupar más de 85px 
                  de ancho, obligándolo a dividirse en dos líneas.
                */}
                <span className="text-center leading-tight max-w-[85px]">
                  {categoriaText}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tarjetas de abogados */}
        <div
          className="mx-auto grid max-w-sm items-start gap-6 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3"
          ref={masonryContainer}
        >
          {testimonios.map((testimonial, index) => (
            <div key={index} className="group">
              <Testimonial testimonial={testimonial} category={categoria}>
                {testimonial.content}
              </Testimonial>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Testimonial({
  testimonial,
  category,
  children,
}: {
  testimonial: {
    img: StaticImageData;
    name: string;
    especialidad: string;
    subespecialidad: string;
    content: string;
    categories: number[];
  };
  category: number;
  children: React.ReactNode;
}) {
  // --- CAMBIO 3 (Filtro): Lógica de opacidad mejorada ---
  const isDimmed =
    category !== 0 && !testimonial.categories.includes(category);
  // --- Fin del cambio ---

  return (
    <article
      // --- CAMBIO 4 (Filtro): Aplicando la nueva lógica ---
      className={`relative rounded-2xl bg-linear-to-br from-gray-900/50 via-gray-800/25 to-gray-900/50 p-5 backdrop-blur-xs transition-opacity before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] ${
        isDimmed ? "opacity-30" : ""
      }`}
      // --- Fin del cambio ---
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Image
            className="inline-flex shrink-0 rounded-full"
            src={testimonial.img}
            width={40}
            height={40}
            alt={testimonial.name}
          />
          <div className="text-sm font-medium text-gray-200">
            <span>{testimonial.name}</span>
            <span className="text-gray-700"> — </span>
            <span className="text-indigo-200/65">
              {testimonial.especialidad}
            </span>
            <p className="text-indigo-400 text-xs">
              {testimonial.subespecialidad}
            </p>
          </div>
        </div>
        <p className="text-indigo-200/65 before:content-['“'] after:content-['”']">
          {children}
        </p>
      </div>
    </article>
  );
}