import React, {Component} from 'react';
import './App.css';
import firebase from './firebase.js';
import Form from './Form.js'
import axios from 'axios'
import RecipeList from './RecipeList.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      drinkRecipes: []
    }

  }
  handleInput = (drink) =>{
    this.getDrinks(drink);
  }

  getDrinks = (drink) =>{
    const url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php'
    console.log(drink)
    axios.get(url, {
      dataResponse: 'json',
      params: {
        s: encodeURI(drink)
      }
    }).then(results => {
      results = results.data.drinks;
      this.setState({
        drinkRecipes: results
      })
    })
  }



  render() {
    return (
      <div className="App">
        <h1>Last Minute Cocktail Generator</h1>
        <Form handlerFromParent={this.handleInput}/>
        <RecipeList drinkRecipes={this.state.drinkRecipes}/>
      </div>
    );
  }
}

export default App;
