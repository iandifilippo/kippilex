export default function CompleteClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; // Layout vacío para ocultar Header
}