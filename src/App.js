import React, {Component} from 'react';
import './App.css';
import firebase from './firebase.js';
import Form from './Form.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Last Minute Cocktail Generator</h1>
        <Form />
      </div>
    );
  }
}

export default App;
