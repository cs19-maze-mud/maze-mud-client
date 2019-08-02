import React, { Component } from 'react';
import { NavLink , Route , withRouter} from 'react-router-dom';
import axios from 'axios';
import logo from './cave_escape_MUD.png';
import './App.css';

import Register from './components/Register';
import Login from './components/Login';
import Game from "./components/Game";
import Lobby from './components/Lobby';
import Footer from './components/Footer';
import GameWorker from './components/GameWorker';

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
      this.props.history.push('/lobby')
    }
  }

  login = () => {
    this.setState({ loggedIn: true })
  }

  logout = () => {
    localStorage.removeItem('token');
    this.setState({ loggedIn: false })
  };

  startGame = () => {
    let token = localStorage.getItem('token')
    axios
      .get('https://maze-mud-server.herokuapp.com/api/adv/init/', { headers: { Authorization: `Token ${token}` } })
      .then(res => {
        console.log(res.data)
        this.setState({
          currentRoom: res.data.current_room
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
      .get('https://maze-mud-server.herokuapp.com/api/adv/join/?columns=3', { headers: { Authorization: `Token ${token}` } })
      .then(res => {
        console.log(res.data)
        this.setState({
          currentRoom: res.data.current_room
        })
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  normalStart = () => {
    let token = localStorage.getItem('token')
    axios
      .get('https://maze-mud-server.herokuapp.com/api/adv/join/', { headers: { Authorization: `Token ${token}` } })
      .then(res => {
        console.log(res.data)
        this.setState({
          currentRoom: res.data.current_room
        })
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  hardStart = () => {
    let token = localStorage.getItem('token')
    axios
      .get('https://maze-mud-server.herokuapp.com/api/adv/join/?columns=10', { headers: { Authorization: `Token ${token}` } })
      .then(res => {
        this.setState({
          currentRoom: res.data.current_room
        })
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  joinAFriend = () => {
    let token = localStorage.getItem('token')
    axios
      .get('', { headers: { Authorization: `Token ${token}` } })
      .then(res => {
        console.log(res.data)
        this.setState({
          currentRoom: res.data.current_room
        })
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  render() {
    const loggedInNav = <nav className="nav-bar">
      <h2 className="title">Cave Escape MUD</h2>
      <NavLink to='/lobby' className='nav-bar-items'>Lobby</NavLink>
      <NavLink onClick={this.logout} className='logout nav-bar-items' to='/' >Logout</NavLink>
    </nav>

    const loggedOutNav = <div>
      <h2 className="title">Cave Escape MUD</h2>
      <nav className="nav-bar">
        <img className="logo" src={logo} alt="cave maze logo" />
      </nav>
    </div>

    return (
      <div className="container">
        { this.state.loggedIn ? loggedInNav : loggedOutNav }

        <Route exact path='/lobby' render={() => <Lobby {...this.props} easyStart={ this.easyStart } normalStart={ this.normalStart } hardStart={ this.hardStart } joinAFriend={ this.joinAFriend } startGame = {this.startGame} />} />
        <Route exact path='/register' render={() => <Register {...this.props} login={this.login}/>} />
        <Route exact path='/' render={() => <Login {...this.props} login={this.login} />} />
        <Route exact path='/game' component={Game} />
        <Route exact path='/gamew' render={() => <GameWorker {...this.props} sup={this.sup}/>}/>
      </div>
    );
  }
}

export default withRouter(App);
