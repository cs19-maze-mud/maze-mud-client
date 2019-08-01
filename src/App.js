import React , {Component} from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Game from "./components/Game"
import { NavLink , Route , withRouter} from 'react-router-dom';

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

  render() {
    return (
      <div className="container">
        { this.state.loggedin ? (
            <nav>
              <NavLink onClick={this.logout} className='logout' to='/' >Logout</NavLink>
              <NavLink to='/game' >Game</NavLink>
            </nav>
          ) : (
            <nav>
              <NavLink exact to='/register'> Register </NavLink>
              <NavLink exact to='/'> Login </NavLink>
            </nav>
          )
  
        }
  
        <Route exact path='/register' render={() => <Register {...this.props} login={this.login}/>} />
        <Route exact path='/' render ={ () => <Login {...this.props} login={this.login} /> }/>
        <Route exact path='/game' component={Game} />
        
      </div>
    );
  }
}

export default withRouter(App);
