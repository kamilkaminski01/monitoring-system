import { useState } from 'react'
import { PATHS } from 'utils/consts'
import useAuth from 'hooks/useAuth'
import './style.scss'
import { Link } from 'react-router-dom'
import useDocumentTitle from 'hooks/useDocumentTitle'
import { GrRevert } from 'react-icons/gr'

const LoginPage = () => {
  useDocumentTitle('Login | Monitoring System')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, error } = useAuth()

  const handleSubmit = (event) => {
    event.preventDefault()
    login({ email, password })
  }

  return (
    <div className="login-form">
      <h1 className="login-form__header">Login</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="login-form__input">
          <input
            type="text"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <label>E-mail</label>
        </div>
        <div className="login-form__input">
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <label>Password</label>
        </div>
        <input className="login-form__btn" type="submit" value="Confirm" />
      </form>
      {error && <p className="login-form--error">Incorrect email or password. Please try again.</p>}
      <div className="login-form__footer">
        <Link to={PATHS.home} className="footer__home-link">
          Home <GrRevert />
        </Link>
      </div>
    </div>
  )
}

export default LoginPage
