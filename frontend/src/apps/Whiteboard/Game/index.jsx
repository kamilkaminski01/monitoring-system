import { useEffect, useContext, useState, useRef } from 'react'
import { ENDPOINTS, PATHS, WEBSOCKET_MESSAGES, WEBSOCKETS, WHITEBOARD } from 'utils/consts'
import './style.scss'
import { useNavigate, useParams } from 'react-router-dom'
import useWebSocket from 'react-use-websocket'
import useUsername from 'hooks/useUsername'
import { useSocketLeave } from 'hooks/useSocketLeave'
import { UsernameContext } from 'providers/username/context'
import { useWhiteboardData } from 'hooks/useWhiteboardData'
import { roomDetails } from 'utils/requests'
import { FaCircle } from 'react-icons/fa'
import { RiExternalLinkLine } from 'react-icons/ri'
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io'
import { swalTimedCornerSuccess } from 'utils/swal'
import { AuthContext } from 'providers/auth/context'
import GameLayout from 'components/atoms/GameLayout'
import classNames from 'classnames'
import Button from 'components/atoms/Button'
import Spinner from 'components/atoms/Spinner'
import useDocumentTitle from 'hooks/useDocumentTitle'

const Whiteboard = () => {
  const { isUsernameSet } = useContext(UsernameContext)
  const { isLogged } = useContext(AuthContext)
  const { roomName } = useParams()
  useDocumentTitle(`${roomName} | Whiteboard`)
  const username = useUsername()
  const websocket = `${WEBSOCKETS.whiteboard}/${roomName}/`
  const { players, setPlayers } = useWhiteboardData(ENDPOINTS.detailsWhiteboard, roomName)
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeColor, setActiveColor] = useState('black')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const data = { color: 'black' }
  let drawing = false
  let url = ''

  const { sendJsonMessage } = useWebSocket(websocket, {
    onOpen: () => {
      if (isUsernameSet && !isLogged) sendJsonMessage(WEBSOCKET_MESSAGES.join(username))
    },
    onMessage: (message) => {
      const data = JSON.parse(message.data)
      const command = data.command
      const user = data.user
      const value = data.value
      if (command === 'join' || command === 'leave') {
        roomDetails(ENDPOINTS.detailsWhiteboard, roomName, true)
          .then((data) => {
            setPlayers(data.players)
          })
          .catch(() => {
            navigate(PATHS.whiteboard)
          })
      } else if (command === 'click' && (user !== username || username === null)) {
        const w = canvasRef.current.width
        const h = canvasRef.current.height
        draw(
          canvasRef.current,
          value.x0 * w,
          value.y0 * h,
          value.x1 * w,
          value.y1 * h,
          value.color,
          false
        )
      } else if (command === 'message') {
        clearCanvas(canvasRef)
        user
          ? swalTimedCornerSuccess(`${user} cleared the board`)
          : swalTimedCornerSuccess('The board has been cleared')
      }
    }
  })

  useSocketLeave(websocket, username, sendJsonMessage)

  useEffect(() => {
    const colors = document.querySelectorAll('.color')
    const canvas = canvasRef.current
    onResize(canvas)

    roomDetails(ENDPOINTS.detailsWhiteboard, roomName, true).then((data) => {
      const w = canvasRef.current.width
      const h = canvasRef.current.height
      data.board_state.forEach((value) => {
        try {
          draw(
            canvasRef.current,
            value.x0 * w,
            value.y0 * h,
            value.x1 * w,
            value.y1 * h,
            value.color,
            false
          )
        } catch {}
      })
      setLoading(false)
    })

    colors.forEach((color) => {
      color.addEventListener('click', onColorChange)
    })
    canvas.addEventListener('mousedown', onDown)
    canvas.addEventListener('mouseup', onUp)
    canvas.addEventListener('mouseout', onUp)
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('touchstart', onDown)
    canvas.addEventListener('touchend', onUp)
    canvas.addEventListener('touchcancel', onUp)
    canvas.addEventListener('touchmove', onMove)
    window.addEventListener('resize', () => {
      onResize(canvas)
    })
    return () => {
      canvas.removeEventListener('mousedown', onDown)
      canvas.removeEventListener('mouseup', onUp)
      canvas.removeEventListener('mouseout', onUp)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('touchstart', onDown)
      canvas.removeEventListener('touchend', onUp)
      canvas.removeEventListener('touchcancel', onUp)
      canvas.removeEventListener('touchmove', onMove)
      window.removeEventListener('resize', () => {
        onResize(canvas)
      })
      colors.forEach((color) => {
        color.removeEventListener('click', onColorChange)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef])

  const draw = (canvas, x0, y0, x1, y1, color, send) => {
    const context = canvas.getContext('2d')
    context.beginPath()
    context.moveTo(x0, y0)
    context.lineTo(x1, y1)
    context.strokeStyle = color
    context.lineWidth = 2
    context.stroke()
    context.closePath()
    context.save()
    url = canvas.toDataURL('image/png')
    if (send) {
      const w = canvas.width
      const h = canvas.height
      const data = {
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color
      }
      sendJsonMessage(WEBSOCKET_MESSAGES.click(username, data))
    }
  }

  const clearCanvas = (canvas) => {
    const context = canvas.current.getContext('2d')
    context.clearRect(0, 0, canvas.current.width, canvas.current.height)
  }

  const onColorChange = (e) => {
    const selectedColor = e.target.className.split(' ')[1]
    data.color = selectedColor
    setActiveColor(selectedColor)
  }

  const onResize = (canvas) => {
    const context = canvas.getContext('2d')
    const img = document.createElement('img')
    img.src = url
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    context.drawImage(img, 0, 0)
    context.restore()
  }

  const onDown = (e) => {
    drawing = true
    data.x = e.clientX || e.touches[0].clientX
    data.y = e.clientY || e.touches[0].clientY
  }

  const onMove = (e) => {
    if (!drawing) return
    try {
      draw(
        canvasRef.current,
        data.x,
        data.y,
        e.clientX || e.touches[0].clientX,
        e.clientY || e.touches[0].clientY,
        data.color,
        true
      )
      data.x = e.clientX || e.touches[0].clientX
      data.y = e.clientY || e.touches[0].clientY
    } catch {}
  }

  const onUp = () => {
    drawing = false
  }

  return (
    <GameLayout className="whiteboard">
      {loading && <Spinner />}
      <canvas ref={canvasRef} className="whiteboard__board" />
      <div className="whiteboard__menu">
        {WHITEBOARD.colors.map((color) => (
          <div
            key={color}
            className={classNames('color', color, { active: activeColor === color })}
          />
        ))}
        <div className="menu__dropdown">
          <Button onClick={() => setShowDropdown(!showDropdown)}>
            {showDropdown ? <IoIosArrowDropup /> : <IoIosArrowDropdown />}
          </Button>
          {showDropdown && (
            <div className="dropdown__items">
              <div className="dropdown__options">
                <Button onClick={() => (window.location.href = PATHS.whiteboard)}>
                  Menu
                  <RiExternalLinkLine />
                </Button>
                <Button
                  onClick={() => sendJsonMessage(WEBSOCKET_MESSAGES.message('clear', username))}>
                  Clear
                </Button>
              </div>
              <div className="dropdown__players">
                {players.map((player) => (
                  <div key={player.username} className="players__username">
                    {player.is_active ? (
                      <FaCircle
                        key={player.is_active}
                        color="limegreen"
                        className="animation--fade-in"
                      />
                    ) : (
                      <FaCircle key={player.is_active} color="red" className="animation--fade-in" />
                    )}
                    {player.username}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </GameLayout>
  )
}

export default Whiteboard
