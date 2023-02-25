import React, { useState } from 'react';
import { PATHS } from 'utils/consts';
import useAuth from 'hooks/useAuth';
import './LoginForm.scss';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAuth();

  const handleSubmit = (event) => {
    event.preventDefault();
    login({ email, password });
  };

  return (
    <div className="login-wrapper">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="txt-field">
          <input
            type="text"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <label>E-mail</label>
        </div>
        <div className="txt-field">
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <label>Password</label>
        </div>
        <input type="submit" value="Confirm" />
      </form>
      {error && <p className="error-message">Incorrect email or password. Please try again.</p>}
      <div className="home">
        <a href={PATHS.home}>Home</a>
      </div>
    </div>
  );
};

export default LoginForm;
