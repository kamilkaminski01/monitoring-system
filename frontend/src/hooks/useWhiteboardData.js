import { useContext, useEffect, useState } from 'react';
import { roomDetails } from 'utils/requests';
import { PATHS } from 'utils/consts';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from 'providers/AuthContextProvider';
import useUsername from 'hooks/useUsername';
import { swalCornerError } from 'utils/swal';

export const useWhiteboardData = (endpoint, roomName) => {
  const username = useUsername();
  const { isLogged } = useContext(AuthContext);
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    roomDetails(endpoint, roomName, true)
      .then((data) => {
        setPlayers(data.players);
        if (isLogged) {
          const playerExists = data.players.some((player) => player.username === username);
          if (playerExists) {
            navigate(PATHS.monitoring);
            swalCornerError(
              'Username error',
              'A whiteboard user in this room has the same username as you, please change it'
            );
          }
        }
      })
      .catch(() => {
        navigate(PATHS.whiteboard);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, roomName]);

  return {
    players,
    setPlayers
  };
};
