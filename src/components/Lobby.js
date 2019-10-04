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

    selectDifficulty = (difficulty) => {
        this.props.selectDifficulty(difficulty)
        this.setState({
            difficultyChosen: true
        })
    }

    render() {

        return (
            <div className="lobby-container">
                <img className="lobby-logo" src="cave_escape_MUD.png" alt="cave maze logo" />
                {   
                    !this.state.difficultyChosen
                    ?
                    <div className='lobby'>
                        <h3>Select Difficulty</h3>
                        <div className='difficulty'>
                            <button className="" onClick={() => this.selectDifficulty('easy')}>Easy</button>
                            <button onClick={() => this.selectDifficulty('normal')}>Normal</button>
                            <button onClick={() => this.selectDifficulty('hard')}>Hard</button>
                        </div>
                    </div>
                    :
                    <div className='Lobby'>
                            <div className='start-game'>
                                <h1>Start Game</h1>
                                {this.props.numPlayers} Players In Lobby<br/>
                                <button onClick={this.props.startGame}>Start Game</button>
                            </div>
                    </div>
                }
                <Chat {...this.props} uuid ={this.props.uuid} moveResponse ={this.props.moveResponse}
                    incrementNumPlayers ={this.props.incrementNumPlayers} startGame ={this.props.startGame}
                />
            </div>
        );
    }
}

export default Lobby;