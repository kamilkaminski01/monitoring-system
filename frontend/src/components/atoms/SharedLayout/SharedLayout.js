import './SharedLayout.scss';
import Footer from 'components/organisms/Footer/Footer';
import Navbar from 'components/organisms/Navbar/Navbar';
import { Outlet } from 'react-router-dom';

const SharedLayout = () => {
  return (
    <div className="shared-layout">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default SharedLayout;
