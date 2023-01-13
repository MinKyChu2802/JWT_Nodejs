import "styles/globals.scss";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps: { session, ...pageProps } }: any) {
  console.log(Component.need);
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer autoClose={5000} />
    </>
  );
}

export default MyApp;
