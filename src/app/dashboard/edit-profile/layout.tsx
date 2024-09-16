export default function EditProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="bg-[#111] w-full min-h-screen">{children}</div>
    </div>
  );
}
