// app/completar-perfil-abogado/layout.tsx
export default function CompleteProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Este layout anula al layout principal que tiene el header y el footer.
  return <>{children}</>;
}