import HomeNav from "@/components/app/HomeNav";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HomeNav />

      {children}
    </>
  );
}
