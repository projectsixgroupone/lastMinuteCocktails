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
      drinkRecipes: [],
      error: false
    }

  }



  handleInput = (drink) =>{
    if(drink) {this.getDrinks(drink)}else{this.setState({
      error:true,
      drinkRecipes: []
      
    })}

  }

  getDrinks = (drink) =>{
    const url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php'
    console.log(drink)
    axios.get(url, {
      dataResponse: 'json',
      params: {
      s: drink
      }
    }).then(results => {
      results = results.data.drinks;

      if(results){
        this.setState({
          drinkRecipes: results,
          error:false
        })} else{
          this.setState({
            error: true,
            drinkRecipes: []
          })
        

      }
     
    })
  }



  render() {
    return (
      <div className="App">
        <h1>Last Minute Cocktail Generator</h1>
        <Form error={this.state.error} handlerFromParent={this.handleInput}/>
        <RecipeList drinkRecipes={this.state.drinkRecipes}/>
      </div>
    );
  }
}

export default App;
