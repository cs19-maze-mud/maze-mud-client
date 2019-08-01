import React from 'react';
import axios from 'axios'
import './game.css'

class Lobby extends React.Component {

    render() {
        
        return (
            <div className='Lobby'>
                <h1>Start New Game</h1>
                <h3>Select Difficulty</h3>
                <div>
                    <button onClick={ this.props.easyStart }>Easy</button>
                    <button onClick={ this.props.normalStart }>Normal</button>
                    <button onClick={ this.props.hardStart }>Hard</button>
                    <button onClick={ this.props.startGame}>Start Game</button>
                </div>

                <div>
                    <h1>Join a Game</h1>
                    <input
                        placeholder = 'Game Id #'    
                    ></input>
                    <button onClick={ this.props.joinAFriend }>Join an existing game</button>
                </div>
            </div>
        );
    }
}


export default Lobby;