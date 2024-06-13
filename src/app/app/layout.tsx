import "@/styles/globals.css";
import { MusicProvider } from "./context";
import MediaPlayer from "@/components/app/mediaplayer";
import FullScreenMediaPlayer from "@/components/app/FullScreenMediaPlayer";
import Footer from "@/components/app/FooterNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MusicProvider>
      <div className="pb-56">{children}</div>
      <div className="fixed bottom-0 w-full">
        <MediaPlayer />
        <Footer />
      </div>
      <FullScreenMediaPlayer />
    </MusicProvider>
  );
}
