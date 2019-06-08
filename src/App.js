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
  getFavouriteDrinks = async () => {
    const url = ` https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=11007`
    let favouriteDrinks = [...this.state.favouriteDrinks]
        
    let favouriteDrinksRequests = favouriteDrinks.map(async id => {
      const response = await axios.get(url, {
        dataResponse: 'json',
        params: {
          i: id
        }
      })
      return response.data.drinks
      })
      const results = await Promise.all(favouriteDrinksRequests)
      console.log(results)

      this.setState({
        drinkRecipes: results.flat()
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
      <div>
       <header>
          <h1>Cocktail Generator</h1>
          <h2>Look Up Any Cocktail In Our Database</h2>
          <Form error={this.state.error} handlerFromParent={this.handleInput}/>
          <button onClick={this.getFavouriteDrinks} className="favouriteDrinks wrapper">Explore Favourite Coctails</button>
        </header>

        <div className="results">
          <RecipeList drinkRecipes={this.state.drinkRecipes} />
        </div>

        <footer>
          <p>Copyright Ⓒ 2019</p>
        </footer>

      </div>

    );
  }
}

export default App;
