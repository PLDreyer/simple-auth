import { useState } from 'react';
import { Authenticator } from '@simple-auth/web';

export function App() {
  const authenticator = new Authenticator('http://localhost:8080');

  const [loginState, setLoginState] = useState(false);
  const [twofaToken, setTwofaToken] = useState('');
  const [userData, setUserData] = useState(undefined);

  const login = async () => {
    const response = await authenticator.login('Max Mustermann', '1234', true);

    if (response.token) {
      setTwofaToken(response.token);
      return;
    }

    setLoginState(true);
  };

  const twofa = async () => {
    const response = await authenticator.twofa(twofaToken, 'test');

    setTwofaToken('');
    setLoginState(true);
  };

  const refresh = async () => {
    const response = await authenticator.refresh();
  };

  const profile = async () => {
    const response = await authenticator.axios.get(
      'http://localhost:8080/users/me'
    );
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
