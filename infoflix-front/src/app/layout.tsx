import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Cabecalho from "../../components/cabecalho/header";
import Rodape from "../../components/rodape/footer";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
        <div className="components">
          <header>
            <Cabecalho/>
          </header>

          <main className="children">{children}</main>

          <footer>
            <Rodape/>
          </footer>

        </div>

        </body>
    </html>
  );
}
