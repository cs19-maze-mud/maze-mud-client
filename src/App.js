import React, { Component } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Game from "./components/Game";
import Lobby from './components/Lobby';
import { NavLink, Route, withRouter } from 'react-router-dom';
import axios from 'axios';
import Footer from './components/Footer';
import GameWorker from './components/GameWorker'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false,
      currentRoom: {}
    }
  }

  login = () => {
    this.setState({ loggedin: true })
  }

  logout = () => {
    localStorage.removeItem('token');
    this.setState({ loggedin: false })
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
        console.log(res.data)
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
    return (
      <div className="container">
        {this.state.loggedin ? (
          <nav>
            <NavLink onClick={this.logout} className='logout' to='/' >Logout</NavLink>
            <NavLink to='/lobby' >Lobby</NavLink>
            <NavLink to='/game' >Game</NavLink>
          </nav>
        ) : (
            <nav>
              <NavLink exact to='/register'> Register </NavLink>
              <NavLink exact to='/'> Login </NavLink>
            </nav>
          )

        }
        <Route exact path='/lobby' render={() => <Lobby {...this.props} easyStart={ this.easyStart } normalStart={ this.normalStart } hardStart={ this.hardStart } joinAFriend={ this.joinAFriend } startGame = {this.startGame} />} />
        <Route exact path='/register' render={() => <Register {...this.props} login={this.login}/>} />
        <Route exact path='/' render={() => <Login {...this.props} login={this.login} />} />
        <Route exact path='/game' component={Game} />
        <Route exact path='/gamew' render={() => <GameWorker {...this.props} sup={this.sup}/>}/>
        {/* <div className='footer'>
          <Footer currentRoom = {this.state.currentRoom}/>
        </div> */}
      </div>
    );
  }
}

export default withRouter(App);
