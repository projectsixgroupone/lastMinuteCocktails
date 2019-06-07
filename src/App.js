import React, {Component} from 'react';
import './App.scss';
import firebase from './firebase.js';
import Form from './Form.js'
import axios from 'axios'
import RecipeList from './RecipeList.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      drinkRecipes: [],
      error: false,
      savedList: {},
      favouriteDrinks: []
    }

  }


  // handles the input the user inputs. If the input is valid, it calls the API. If not, it sets an error in state.
  handleInput = (drink) =>{
    if(drink) {this.getDrinks(drink)}else{this.setState({
      error:true,
      drinkRecipes: []
      
    })}

  }

  // API call takes user input as a query 
  getDrinks = (drink) =>{
    const url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php'
    // console.log(drink)
    axios.get(url, {
      dataResponse: 'json',
      params: {
      s: drink
      }
    }).then(results => {
      results = results.data.drinks;

      // if there is no result or API calls nothing, show an error. Otherwise save results to state
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

  componentDidMount() {
    const dbref = firebase.database().ref('drinks');
    dbref.on('value', (response) => {
      let drinks = response.val()
      let favouriteDrinks = []
      drinks = Object.entries(drinks)
      drinks.map(drink => {
        if(drink[1].favourite === true) {
          favouriteDrinks.push(drink[0])
        }
      })
      this.setState({ favouriteDrinks })
      }      
      
    )
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
