import React, {Component} from 'react';
import './App.css';
import firebase from './firebase.js';
import Form from './Form.js'
import axios from 'axios'

class App extends Component {
  constructor() {
    super()

  }
  handleInput = (drink) =>{
    this.getDrinks(drink);
  }

  getDrinks = (drink) =>{
    const url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php'

    axios.get(url, {
      dataResponse: 'json',
      params: {
        s: encodeURI(drink)
      }
    }).then(result => {
      console.log(result)
    })
  }



  render() {
    return (
      <div className="App">
        <h1>Last Minute Cocktail Generator</h1>
        <Form handlerFromParent={this.handleInput}/>
      </div>
    );
  }
}

export default App;
