export default async function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="w-full h-auto max-h-screen  py-3 px-5 pt-10 md:mt-0 md:mx-0 overflow-y-auto pb-24 ">
        {children}
      </div>
    </>
  );
}
