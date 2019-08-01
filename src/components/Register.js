import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'

class Register extends React.Component {
    state = {
        username: '',
        password1: '',
        password2: ''
    }

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }

    handleSubmit = event => {
        event.preventDefault();
        axios
            .post('https://maze-mud-server.herokuapp.com/api/registration/', this.state)
            .then(res => {
                console.log(res.data);
                const token = res.data.key;
                localStorage.setItem('token', token)
            })
            .catch(err => {
                console.log(err.response)
            })
    };

    render() {
        return (
            <div className='RegisterContainer'>
                <h2>Register Here</h2>
                
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
                        name = 'password1'
                        placeholder = 'Password Please'
                        value = {this.state.password1}
                        onChange = {this.handleChange}
                    />

                    <input 
                        type = 'password'
                        name = 'password2'
                        placeholder = 'Verify Password'
                        value = {this.state.password2}
                        onChange = {this.handleChange}
                    />
                    <button type='submit'>Register Account</button>
                </form>
                {/* <Link to='/login'>Login</Link> */}
            </div>
        );
    };
};

export default Register;