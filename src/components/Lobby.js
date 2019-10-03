import React from 'react';
import './Lobby.css'
import Chat from './Chat';

class Lobby extends React.Component {
    constructor(props) {
        super(props)

        if(props.inGame) {
            this.state = {
                difficultyChosen: true
            }
        } else {
            this.state = {
                difficultyChosen: false
            }
        }
    }

    componentDidMount = () => {
        this.props.getGame()
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.inGame) {
            this.setState({
                difficultyChosen: nextProps.inGame
            })
        }
    }

    render() {

        return (
            <div>
                <img className="lobby-logo" src="cave_escape_MUD.png" alt="cave maze logo" />
                {   
                    !this.state.difficultyChosen
                    ?
                    <div className='Lobby'>
                        <h1>Start New Game</h1>
                        <h3>Select Difficulty</h3>
                        <div
                            className='difficulty'
                            onClick={() => this.setState({difficultyChosen: true})}>
                            <button className="" onClick={this.props.easyStart}>Easy</button><br/>
                            <button onClick={this.props.normalStart}>Normal</button><br/>
                            <button onClick={this.props.hardStart}>Hard</button><br/>
                        </div>
                    </div>
                    :
                    <div className='Lobby'>
                            <h1>Game Lobby</h1>
                            <div className='start-game'>
                                {this.props.numPlayers} Players In Lobby<br/>
                                <button onClick={this.props.startGame}>Start Game</button>
                            </div>
                            <Chat {...this.props} uuid={this.props.uuid} moveResponse={this.props.moveResponse} incrementNumPlayers={this.props.incrementNumPlayers} startGame={this.props.startGame}/>
                    </div>
                }
            </div>
        );
    }
}

export default Lobby;