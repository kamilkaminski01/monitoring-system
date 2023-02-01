import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { PATHS } from 'utils/consts';
import { AuthContext } from 'providers/AuthContextProvider';

const ProtectedRoutes = () => {
  const { isLogged } = useContext(AuthContext);
  return isLogged ? <Outlet /> : <Navigate to={PATHS.login} />;
};

export default ProtectedRoutes;
