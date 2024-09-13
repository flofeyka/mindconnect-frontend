export default function DoctorDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="bg-[#111] w-full h-full">{children}</div>
    </div>
  );
}
