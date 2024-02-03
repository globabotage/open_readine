import AdminSidebar from "./_components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="text-yt-white w-full flex flex-row  h-auto max-h-[90vh] overflow-y-auto justify-center">
      <AdminSidebar />
      {children}
    </div>
  );
}
