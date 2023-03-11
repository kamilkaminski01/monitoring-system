import { useContext, useState } from 'react';
import { AuthContext } from 'providers/AuthContextProvider';
import { useNavigate } from 'react-router-dom';
import axiosDefault from 'setup/axios/defaultInstance';
import { ENDPOINTS, LOCAL_STORAGE, PATHS } from 'utils/consts';

const useAuth = () => {
  const { login: loginContext } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const login = (data) => {
    axiosDefault
      .post(ENDPOINTS.getToken, data)
      .then((response) => {
        localStorage.setItem(LOCAL_STORAGE.accessToken, response.data.access);
        localStorage.setItem(LOCAL_STORAGE.refreshToken, response.data.refresh);
        localStorage.setItem(LOCAL_STORAGE.username, 'admin');
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
