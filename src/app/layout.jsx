import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../../public/css/style.css";
import "../../public/css/bootstrap.min.css";
import Script from "next/script";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ReduxProvider from "@/redux/ReduxProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Raleway:wght@600;800&display=swap"
          rel="stylesheet"
        />

        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css"
          rel="stylesheet"
        />

        {/* <!-- Libraries Stylesheet --> */}
        <link href="lib/lightbox/css/lightbox.min.css" rel="stylesheet" />
        <link
          href="lib/owlcarousel/assets/owl.carousel.min.css"
          rel="stylesheet"
        />

        {/* <!-- Customized Bootstrap Stylesheet --> */}
        <link href="css/bootstrap.min.css" rel="stylesheet" />
      </head>
      <body>
        <ReduxProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ReduxProvider>

        <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js" />
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js" />
        <Script src="lib/easing/easing.min.js" />
        <Script src="lib/waypoints/waypoints.min.js" />
        <Script src="lib/lightbox/js/lightbox.min.js" />
        <Script src="lib/owlcarousel/owl.carousel.min.js" />

        {/* <!-- Template Javascript --> */}
        <Script src="js/main.js" />
      </body>
    </html>
  );
}
