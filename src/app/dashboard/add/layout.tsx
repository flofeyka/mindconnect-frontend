export default function DoctorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-[#111] min-h-screen">
      <div className=" w-full h-full">{children}</div>
    </div>
  );
}
