import Footer from '../../organisms/Footer/Footer.js';
import Navbar from '../../organisms/Navbar/Navbar.js';
import { Outlet } from 'react-router-dom';

const SharedLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default SharedLayout;
