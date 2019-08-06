import React from 'react';
import './Lobby.css'
import Chat from './Chat';

class Lobby extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            difficultyChosen: false
        }
    }
    render() {

        return (
            <div className='Lobby'>
                <img className="logo" src="cave_escape_MUD.png" alt="cave maze logo" />
                <h1>Start New Game</h1>
                <h3>Select Difficulty</h3>
                <div
                    className='difficulty'
                    onClick={() => this.setState({difficultyChosen: true})}>
                    <button className="" onClick={this.props.easyStart}>Easy</button>
                    <button onClick={this.props.normalStart}>Normal</button>
                    <button onClick={this.props.hardStart}>Hard</button>
                </div>
                {this.state.difficultyChosen
                    ? <div>
                        <div className='start-game'>
                            {this.props.numPlayers} Players In Lobby<br/>
                            <button onClick={this.props.startGame}>Start Game</button>
                        </div>
                        <Chat {...this.props} uuid={this.props.uuid} moveResponse={this.props.moveResponse} incrementNumPlayers={this.props.incrementNumPlayers} startGame={this.props.startGame}/>
                    </div>
                    : null}
            </div>
        );
    }
}

export default Lobby;