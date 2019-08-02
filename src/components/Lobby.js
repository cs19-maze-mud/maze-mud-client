import React from 'react';
import './Lobby.css'
import logo from '../cave_escape_MUD.png';

class Lobby extends React.Component {
    state = {
        difficultyChosen: false
    }
    render() {

        return (
            <div className='Lobby'>
                <img className="logo" src={logo} alt="cave maze logo" />
                <h1>Start New Game</h1>
                <h3>Select Difficulty</h3>
                <div
                    className='difficulty'
                    onClick={() => this.setState({difficultyChosen: true})}>
                    <button onClick={this.props.easyStart}>Easy</button>
                    <button onClick={this.props.normalStart}>Normal</button>
                    <button onClick={this.props.hardStart}>Hard</button>
                </div>
                {this.state.difficultyChosen
                    ? <div className='start-game'>
                            <button onClick={this.props.startGame}>Start Game</button>
                        </div>
                    : null}
            </div>
        );
    }
}

export default Lobby;