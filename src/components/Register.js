import React from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

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
            .post(`${process.env.REACT_APP_SERVER}/api/registration/`, this.state)
            .then(res => {
                const token = res.data.key;
                localStorage.setItem('token', token)
                this.props.login();
                this.props.history.push('/lobby');
            })
            .catch(err => {
                console.log(err.response)
            })    
    };

    render() {
        return (
        <div>
            <div className='account-container'>
                <h2>Register</h2>
                
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
                    <button type='submit'>Submit</button>
                </form>
            </div>
            <div>
                <NavLink className='nav-bar-items' to='/'> Login Here </NavLink>
            </div>
        </div>
        );
    };
};

export default Register;