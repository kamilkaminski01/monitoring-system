import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsernameContext } from 'providers/UsernameContextProvider';
import { AuthContext } from 'providers/AuthContextProvider';
import { PATHS } from 'utils/consts';
import { swalCornerError } from 'utils/swal';

const useValidUsername = () => {
  const { username, isUsernameSet } = useContext(UsernameContext);
  const { isLogged } = useContext(AuthContext);
  const navigate = useNavigate();

  if (isUsernameSet) return username;
  if (isLogged) return;

  navigate(PATHS.home);
  swalCornerError(null, 'You must provide a username before joining a game.');
};

export default useValidUsername;
