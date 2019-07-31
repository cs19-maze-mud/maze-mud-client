import React from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Game from "./components/Game"

function App() {
  return (
    <div className="container">
      <Register/>
      <Login />
      <Game />
    </div>
  );
}

export default App;
