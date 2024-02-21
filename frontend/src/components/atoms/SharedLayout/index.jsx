import Footer from 'components/organisms/Footer'
import Navbar from 'components/organisms/Navbar'
import { Outlet } from 'react-router-dom'

const SharedLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

export default SharedLayout
