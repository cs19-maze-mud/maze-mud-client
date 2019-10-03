import React, { Component } from 'react';
import { NavLink , Route , withRouter} from 'react-router-dom';
import axios from 'axios';
import './App.css';

import Register from './components/Register';
import Login from './components/Login';
import Game from "./components/Game";
import Lobby from './components/Lobby';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      currentRoom: {}
    }
  }

  componentDidMount = () => {
    if (localStorage.getItem('token') !== null) {
      this.setState({
        loggedIn: true
      })
      this.getGame()
    }
  }

  login = () => {
    this.setState({ loggedIn: true })
    this.getGame()
  }

  logout = () => {
    const token = localStorage.getItem('token');
    localStorage.removeItem('token');
    this.setState({ loggedIn: false })

    axios
      .get(`${process.env.REACT_APP_SERVER}/api/adv/end/`, { headers: { Authorization: `Token ${token}` } })
      .then()
      .catch(error => {
        console.log(error.message)
      })
  };

  getGame = () => {
    const token = localStorage.getItem('token');
    return axios
      .get(`${process.env.REACT_APP_SERVER}/api/adv/get_game/`, { headers: { Authorization: `Token ${token}` } })
      .then(({ data }) => {
        if (data.in_game) { 
          this.setState({
            inGame: data.in_game,
            currentRoom: data.current_room,
            game: data.game,
            user: data.user,
            numPlayers: data.game.num_players
          });
        } else {
          this.setState({
            inGame: false,
            user: data.user
          });
        }

        if (this.state.inGame && this.state.game.in_progress) {
          this.props.history.push('/game');
        } else {
          this.props.history.push('/lobby');
        }

      })
      .catch(error => {
        console.log(error)
      })
  };

  startGame = () => {
    let token = localStorage.getItem('token')
    axios
      .get(`${process.env.REACT_APP_SERVER}/api/adv/init/`, { headers: { Authorization: `Token ${token}` } })
      .then(res => {
        this.setState({
          currentRoom: {
            ...res.data.current_room,
            in_progress: res.data.game.in_progress
          }
        })
      })
      .catch(error => {
        console.log(error.message)
      })
      this.props.history.push( '/game' )
  }

  easyStart = () => {
    let token = localStorage.getItem('token')
    axios
      .get(`${process.env.REACT_APP_SERVER}/api/adv/join/?columns=3`, { headers: { Authorization: `Token ${token}` } })
      .then(res => {
        this.setState({
          currentRoom: res.data.current_room,
          uuid: res.data.user.uuid,
          moveResponse: {
            players: res.data.game.usernames
          },
          numPlayers: res.data.game.num_players,
        })
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  normalStart = () => {
    let token = localStorage.getItem('token')
    axios
      .get(`${process.env.REACT_APP_SERVER}/api/adv/join/`, { headers: { Authorization: `Token ${token}` } })
      .then(res => {
        this.setState({
          currentRoom: res.data.current_room,
          uuid: res.data.user.uuid,
          moveResponse: {
            players: res.data.game.usernames
          },
          numPlayers: res.data.game.num_players,
        })
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  hardStart = () => {
    let token = localStorage.getItem('token')
    axios
      .get(`${process.env.REACT_APP_SERVER}/api/adv/join/?columns=10`, { headers: { Authorization: `Token ${token}` } })
      .then(res => {
        this.setState({
          currentRoom: res.data.current_room,
          uuid: res.data.user.uuid,
          moveResponse: {
            players: res.data.game.usernames
          },
          numPlayers: res.data.game.num_players,
        })
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  incrementNumPlayers = () => {
    this.setState({numPlayers: this.state.numPlayers + 1})
  }

  render() {
    const loggedInNav = <nav className="nav-bar">
      <h2 className="title">Cave Escape MUD</h2>
      <div>
        <NavLink to='/lobby' className='nav-bar-items'>Lobby</NavLink>
        <NavLink onClick={this.logout} className='logout nav-bar-items' to='/' >Logout</NavLink>
      </div>
    </nav>

    const loggedOutNav = <div>
      <h2 className="title">Cave Escape MUD</h2>
        <img className="logo" src="cave_escape_MUD.png" alt="cave maze logo" />
    </div>

    return (
      <div className="container">
        { this.state.loggedIn ? loggedInNav : loggedOutNav }

        <Route exact path='/lobby' render={() => <Lobby {...this.props} {...this.state} easyStart={this.easyStart} normalStart={this.normalStart} hardStart={this.hardStart} startGame={this.startGame} incrementNumPlayers={this.incrementNumPlayers} getGame={this.getGame}/>} />
        <Route exact path='/register' render={() => <Register {...this.props} login={this.login}/>} />
        <Route exact path='/' render={() => <Login {...this.props} login={this.login} />} />
        <Route exact path='/game' render={() => <Game {...this.props} {...this.state} getGame={this.getGame} />} />
      </div>
    );
  }
}

export default withRouter(App);
