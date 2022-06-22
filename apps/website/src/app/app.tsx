import NxWelcome from './nx-welcome';
import { Route, Routes, Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

export function App() {
  const [loginState, setLoginState] = useState(false);
  const [twofaToken, setTwofaToken] = useState(undefined);
  const [userData, setUserData] = useState(undefined);

  const login = async () => {
    const response = await axios.post('http://localhost:8080/auth/login', {
      email: 'Max Mustermann',
      password: '1234',
    });

    if (response.data.token) {
      setTwofaToken(response.data.token);
      return;
    }

    setLoginState(true);
  };

  const twofa = async () => {
    const response = await axios.post('http://localhost:8080/auth/twofa', {
      token: twofaToken,
      code: 'test',
    });

    setTwofaToken(undefined);
    setLoginState(true);
  };

  const refresh = async () => {
    const response = await axios.post('http://localhost:8080/auth/refresh', {});
  };

  const profile = async () => {
    const response = await axios.get('http://localhost:8080/users/me');
    setUserData(response.data);
  };

  return (
    <>
      <div>login: {loginState}</div>
      <div>twofa: {twofaToken}</div>
      <div>UserData: {userData ? JSON.stringify(userData) : 'not loaded'}</div>
      <button onClick={() => login()}>login</button>
      <button onClick={() => twofa()}>twofa</button>
      <button onClick={() => refresh()}>refresh</button>
      <button onClick={() => profile()}>profile</button>
    </>
  );
}

export default App;
