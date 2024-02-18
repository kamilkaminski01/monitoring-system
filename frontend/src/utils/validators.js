import { swalCornerError } from 'utils/swal'

export const isInputValid = (input) => {
  return /^[a-zA-Z0-9-_]+$/.test(input) && input.length <= 10
}

export const validateHomeData = (username, roomName, playersLimit = null) => {
  const isUsernameValid = isInputValid(username)
  const isRoomNameValid = isInputValid(roomName)

  if (!isRoomNameValid) {
    swalCornerError('Room error', 'Room name is invalid')
    return false
  }
  if (!isUsernameValid) {
    swalCornerError('Username error', 'Username is invalid')
    return false
  }
  if (playersLimit !== null && playersLimit === '') {
    swalCornerError('Room error', 'Provide a players limit')
    return false
  }
  return true
}

export const validateCreateGameData = (username) => {
  const isUsernameValid = isInputValid(username)
  if (!isUsernameValid) {
    swalCornerError('Username error', 'Username is invalid')
    return false
  }
  return true
}
