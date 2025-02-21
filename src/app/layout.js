import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Rate My Professor",
  description: "",
  icons: {
    icon: [

      { url: '/professor.png', type: 'image/png', sizes: '32x32' },

    ],

  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster 

        position="top-right"

        toastOptions={{

          // Default options

          duration: 4000,

          style: {

            background: '#363636',

            color: '#fff',

          },

        }}

      />
      </body>
    </html>
  );
}
