import React, { Component } from 'react';
import Nav from './components/Nav';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import EstabelecimentosList from './components/EstabelecimentosList';
import './App.css';
import { getLocation } from './utils';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayed_form: '',
      logged_in: localStorage.getItem('token') ? true : false,
      username: '',
      estabelecimentos: [],
      location: null
    };
  }

  componentDidMount() {
    if (this.state.logged_in) {
      fetch('http://localhost:8000/core/current_user/', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(json => {
          this.getEstabelecimentos();
          getLocation().then(loc => {
            this.setState({ username: json.username, location: loc });
          });
        });
    }
  }

  handle_login = (e, data) => {
    e.preventDefault();
    fetch('http://localhost:8000/token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.user.username
        });
      });
  };

  handle_logout = () => {
    localStorage.removeItem('token');
    this.setState({ logged_in: false, username: '' });
  };

  handle_signup = (e, data) => {
    e.preventDefault();
    fetch('http://localhost:8000/core/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.username
        });
      });
  };

  getEstabelecimentos = () => {
    fetch('http://localhost:8000/core/etabelecimentos/', {
      headers: {
        Authorization: `JWT ${localStorage.getItem('token')}`
      }
    }).then(resp => {
      resp.json().then(data => {
        this.setState({ estabelecimentos: data });
      });
    });
  };

  display_form = form => {
    this.setState({
      displayed_form: form
    });
  };

  render() {
    let form;
    switch (this.state.displayed_form) {
      case 'login':
        form = <LoginForm handle_login={this.handle_login} />;
        break;
      case 'signup':
        form = <SignupForm handle_signup={this.handle_signup} />;
        break;
      default:
        form = null;
    }

    return (
      <div className="App">
        <h3>
          {this.state.logged_in
            ? `Olá, ${this.state.username}`
            : 'Você não está autenticado ou cadastrado.'}
        </h3>
        <Nav
          logged_in={this.state.logged_in}
          display_form={this.display_form}
          handle_logout={this.handle_logout}
        />
        {form}
        {this.state.username && <EstabelecimentosList 
          estabelecimentos={this.state.estabelecimentos}
          lat={this.state.location && this.state.location.coords.latitude}
          lon={this.state.location && this.state.location.coords.longitude} />}
      </div>
    );
  }
}

export default App;
