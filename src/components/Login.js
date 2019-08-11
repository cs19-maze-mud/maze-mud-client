import React from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

class Login extends React.Component {
  state = {
    username: '',
    password: '',
  }

  handleChange = event => {
      this.setState({[event.target.name]: event.target.value})
  }

  handleSubmit = event => {
    event.preventDefault();
    const heroku = process.env.REACT_APP_SERVER
    axios
      .post(`${heroku}/api/login/`, this.state)
      .then(res => {
        const token = res.data.key;
        localStorage.setItem('token', token)
        this.props.login()
        this.props.history.push('/lobby')
      })
      .catch(err => {
        console.log(err.response)
      })
    
  };

  render() {
    return (
      <div>
        <div className='LoginContainer'>        
          <h2>Login</h2>
          
          <form className="account" onSubmit={this.handleSubmit}>
            <input
              type = 'text'
              name = 'username'
              placeholder = 'Username'
              value = {this.state.username}
              onChange = {this.handleChange}
            />

            <input 
              type = 'password'
              name = 'password'
              placeholder = 'Password Please'
              value = {this.state.password}
              onChange = {this.handleChange}
            />
            <button type='submit'>Submit</button>
          </form>
        </div>
        <div>
          <NavLink className='nav-bar-items' exact to='/register'> Register Here </NavLink>
        </div>
      </div>
    );
  };
};

export default Login;