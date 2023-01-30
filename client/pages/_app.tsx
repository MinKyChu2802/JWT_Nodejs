import 'styles/globals.scss'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import { ToastContainer } from 'react-toastify'
import AOS from 'aos'
import { useEffect } from 'react'
import { WindowSizeWrapper } from 'store/windowSize'

function MyApp({ Component, pageProps: { session, ...pageProps } }: any) {
  useEffect(() => {
    AOS.init()
  }, [])

  return (
    <>
      <WindowSizeWrapper />
      <Component {...pageProps} />
      <ToastContainer autoClose={5000} />
    </>
  )
}

export default MyApp
