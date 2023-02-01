import { useContext, useState } from 'react';
import { AuthContext } from 'providers/AuthContextProvider';
import { useNavigate } from 'react-router-dom';
import axiosAuth from 'setup/axios/authInstance';
import { ENDPOINTS, LOCAL_STORAGE, PATHS } from 'utils/consts';

const useAuth = () => {
  const { login: loginContext } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const login = (data) => {
    axiosAuth
      .post(ENDPOINTS.getToken, data)
      .then((response) => {
        localStorage.setItem(LOCAL_STORAGE.accessToken, response.data.access);
        localStorage.setItem(LOCAL_STORAGE.refreshToken, response.data.refresh);

        loginContext();
        navigate(PATHS.monitoring);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return {
    login,
    error
  };
};

export default useAuth;
