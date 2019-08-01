import React from 'react';
import axios from 'axios';

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
    const heroku = 'https://maze-mud-server.herokuapp.com'
    axios
      .post(`${heroku}/api/login/`, this.state)
      .then(res => {
        console.log(res.data);
        const token = res.data.key;
        localStorage.setItem('token', token)
        this.props.login()
        this.props.history.push( '/game' )
      })
      .catch(err => {
        console.log(err.response)
      })
    this.props.login()
    this.props.history.push( '/lobby' )
  };

  render() {
    return (
      <div className='LoginContainer'>
        <h2>Login Here</h2>
        
        <form onSubmit={this.handleSubmit}>
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
          <button type='submit'>Login Submit</button>
        </form>
      </div>
    );
  };
};

export default Login;