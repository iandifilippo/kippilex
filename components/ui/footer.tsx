import Link from "next/link";
import Image from "next/image";
import FooterIllustration from "@/public/images/footer-illustration.svg";

export default function Footer() {
  return (
    <footer>
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Ilustración de fondo (se mantiene) */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -translate-x-1/2"
          aria-hidden="true"
        >
          <Image
            className="max-w-none"
            src={FooterIllustration}
            width={1076}
            height={378}
            alt="Footer illustration"
          />
        </div>

        {/* Contenido principal del Footer (4 columnas) */}
        <div className="grid grid-cols-2 justify-between gap-12 py-8 md:grid-cols-4 md:py-12">
          
          {/* 1er Bloque (Branding y Redes) */}
          <div className="col-span-2 space-y-2 md:col-span-1">
            
            {/* --- CAMBIO 1: Logo KippiLex más grande --- */}
            <div className="mb-3">
              <Link href="/" aria-label="KippiLex">
                <Image
                  src="/images/kippilexlogo.png"
                  width={48} // Aumentado a 48px
                  height={48} // Aumentado a 48px
                  alt="KippiLex Logo"
                />
              </Link>
            </div>
            {/* --- FIN DEL CAMBIO 1 --- */}

            <p className="text-sm text-indigo-200/65">
              Conectando a nuestros clientes con los mejores
            </p>
            
            {/* --- CAMBIO 2: Íconos de redes --- */}
            {/* (Añadido Facebook y Twitter, y aumentado el 'gap') */}
            <ul className="inline-flex gap-3">
              {/* Instagram */}
              <li>
                <a
                  className="flex items-center justify-center text-indigo-500 transition hover:text-indigo-400"
                  href="https://www.instagram.com/kippilex/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Image
                    src="/images/insta.png"
                    width={32}
                    height={32}
                    alt="Instagram Logo"
                  />
                </a>
              </li>
              {/* Facebook (nuevo) */}
              <li>
                <a
                  className="flex items-center justify-center text-indigo-500 transition hover:text-indigo-400"
                  href="#0" // Enlace vacío
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Image
                    src="/images/facebook.png"
                    width={32}
                    height={32}
                    alt="Facebook Logo"
                  />
                </a>
              </li>
              {/* Twitter (nuevo) */}
              
            </ul>
            {/* --- FIN DEL CAMBIO 2 --- */}

          </div>

          {/* 2do Bloque (Producto) */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-200">Producto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500"
                  href="#0"
                >
                  Para abogados
                </a>
              </li>
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500"
                  href="#0"
                >
                  Para clientes
                </a>
              </li>
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500"
                  href="#0"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* 3er Bloque (Compañía) */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-200">Compañía</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500"
                  href="#0"
                >
                  Sobre nosotros
                </a>
              </li>
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500"
                  href="#0"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* 4to Bloque (Legal) */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-200">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500"
                  href="#0"
                >
                  Términos de servicio
                </a>
              </li>
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500"
                  href="#0"
                >
                  Política de privacidad
                </a>
              </li>
              <li>
                <a
                  className="text-indigo-200/65 transition hover:text-indigo-500"
                  href="#0"
                >
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra inferior de Copyright */}
        <div className="border-t py-4 text-center [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-400/.25),transparent)1]">
          <p className="text-sm text-indigo-200/65">
            © KippiLex. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}