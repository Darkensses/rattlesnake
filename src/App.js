import React from 'react';
import './App.css';
import Rattlesnake from './components/Rattlesnake';

function App() {
  return (
    <div className="app">
      <div className="rattlesnake">
        <Rattlesnake />
      </div>

      <div className="lyric">
        <a href="https://www.youtube.com/watch?v=Q-i1XZc8ZwA" target="_blank" rel="noopener noreferrer">
          <h1>I'm the serpent, Devil's servant</h1>
        </a>
      </div>
      <div className="div__gif">
        <img src={require("./img/rattlesnake.webp")} />
      </div>
    </div>
  );
}

export default App;
