import React , {Component} from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Game from "./components/Game"
import { NavLink , Route , withRouter} from 'react-router-dom';
import logo from './cave_escape_MUD.png';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false
    }
  }

  login = () => {
    this.setState({ loggedin: true }) 
  }

  logout = () => {
    localStorage.removeItem('token');
    this.setState({ loggedin: false }) 
  };

  render() {
    const loggedInNav = <nav className="nav-bar">
      <NavLink onClick={this.logout} className='logout nav-bar-items' to='/' >Logout</NavLink>
    </nav>

    const loggedOutNav = <nav className="nav-bar">
      <img className="logo" src={logo} alt="cave maze logo" />
    </nav>

    return (
      <div className="container">
        { this.state.loggedin ? loggedInNav : loggedOutNav }
  
        <Route exact path='/register' component={Register} />
        <Route exact path='/' render ={ () => <Login {...this.props} login={this.login} /> }/>
        <Route exact path='/game' component={Game} />
        
      </div>
    );
  }
}

export default withRouter(App);
