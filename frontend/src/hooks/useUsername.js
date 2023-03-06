import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsernameContext } from 'providers/UsernameContextProvider';
import { PATHS } from 'utils/consts';
import { swalCornerError } from 'utils/swal';

const useUsername = () => {
  const { username, isUsernameSet } = useContext(UsernameContext);
  const navigate = useNavigate();

  if (!isUsernameSet) {
    navigate(PATHS.home);
    swalCornerError(null, 'Provide a username before joining');
  }

  return username;
};

export default useUsername;
