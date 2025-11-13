export const metadata = {
  // --- CAMBIO 1 ---
  title: "Restablecer Contraseña - KippiLex",
  description: "Página para restablecer la contraseña en KippiLex",
};

import Link from "next/link";

export default function ResetPassword() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              {/* --- CAMBIO 2 --- */}
              Restablece tu contraseña
            </h1>
          </div>
          {/* Contact form */}
          <form className="mx-auto max-w-[400px]">
            <div>
              <label
                className="mb-1 block text-sm font-medium text-indigo-200/65"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-input w-full"
                // --- CAMBIO 3 ---
                placeholder="Tu email"
              />
            </div>
            <div className="mt-6">
              <button className="btn w-full bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%]">
                {/* --- CAMBIO 4 --- */}
                Restablecer contraseña
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}