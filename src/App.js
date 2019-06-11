import React, {Component} from 'react';
import './App.scss';
import firebase from './firebase.js';
import Form from './Form.js'
import axios from 'axios'
import RecipeList from './RecipeList.js';
import Dropdown from "./Dropdown.js";
// create the Dropdown component that holds the dropdown and onclick/change events
// create onChange on the select, and onClick on the button
// created a function "getFiltereddrinks" that will be fired once the button is clicked
// once creating getfilteredDrinks we had to pass event and filteredDrinkName
// create a function where we create new arrays "narrowitDown"
// 
class App extends Component {
  constructor() {
    super();
    this.myRef = React.createRef();
    this.state = {
      drinkRecipes: [],
      filteredDrinks:[],
      error: false,
      savedList: {},
      favouriteDrinks: []

    };
  }

  // handles the input the user inputs. If the input is valid, it calls the API. If not, it sets an error in state.
  handleInput = drink => {
    if (drink) {
      this.getDrinks(drink);
      this.setState({
        filteredDrinks: []
      })
    } else {
      this.setState({
        error: true,
        drinkRecipes: []

      });
    }
  };
 
  getFilteredDrinks = (event, choiceDrink) => {
    event.preventDefault();
    if (choiceDrink !== `All`) {
      const filteredDrinks = this.state.drinkRecipes.filter(item => {
        // if the user choice "Alcoholic" drinks then we push those items in here
        // else they chose, nonalcoholic
        return item.strAlcoholic === choiceDrink;
      });
      console.log(filteredDrinks);
      this.setState({
        filteredDrinks: filteredDrinks,
      })
    } else {
      this.setState({
        filteredDrinks: [],
      })
    }
  };
   

  narrowItDown = filteredDrinkName => {
    const copyOfDrinkRecipes = Array.from(this.state.drinkRecipes);
    console.log(copyOfDrinkRecipes);
  };

  // API call takes user input as a query
  getDrinks = drink => {
    const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php";
    // console.log(drink)
    axios
      .get(url, {
        dataResponse: "json",
        params: {
          s: drink,
        },
      })
      .then(results => {
        results = results.data.drinks;

        // something to hold strAlcholicID

        // if there is no result or API calls nothing, show an error. Otherwise save results to state
        if (results) {
          this.setState({
            drinkRecipes: results,
            error: false,
          });
        } else {
          this.setState({
            error: true,
            drinkRecipes: [],
          });
        }
      });
  };
  getFavouriteDrinks = async () => {
    const url = ` https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=11007`;
    let favouriteDrinks = [...this.state.favouriteDrinks];

    let favouriteDrinksRequests = favouriteDrinks.map(async id => {
      const response = await axios.get(url, {
        dataResponse: "json",
        params: {
          i: id
        }
      })
      return response.data.drinks
      })
      const results = await Promise.all(favouriteDrinksRequests)
      console.log(results)

      this.setState({
        drinkRecipes: results.flat(),
        filteredDrinks: []
      })
    
  }

  componentDidMount() {
    const dbref = firebase.database().ref("drinks");
    dbref.on("value", response => {
      let drinks = response.val();
      let favouriteDrinks = [];
      drinks = Object.entries(drinks);
      drinks.map(drink => {
        if (drink[1].favourite === true) {
          favouriteDrinks.push(drink[0]);
        }
      });
      this.setState({ favouriteDrinks });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.drinkRecipes !== this.state.drinkRecipes) {
      this.myRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "start"
      })
    }
  }

  render() {
  let drinkRecipes = this.state.drinkRecipes;
  if (this.state.filteredDrinks.length > 0){
    drinkRecipes = this.state.filteredDrinks;
  }
    return (
      <div>
        <header>
          <nav>
            <div className="wrapper">
              <button onClick={this.getFavouriteDrinks} className="favouriteDrinks" aria-label="Favourite Drinks">Favourite Drinks</button>
            </div>
          </nav>
          <div className="wrapper">
            <h1>Last Minute Cocktails</h1>
            <h2>Find the perfect recipe for your next drink!</h2>
          </div>

          <Form error={this.state.error} handlerFromParent={this.handleInput}/>
        </header>

        <main className="results" ref={this.myRef}>
          {this.state.drinkRecipes.length > 0 ? <Dropdown getFilteredDrinks={this.getFilteredDrinks} />:null}
          <RecipeList
            filteredDrinks={this.state.filteredDrinks}
            drinkRecipes={drinkRecipes}
          />
        </main>

        <footer>
          <p>Copyright Ⓒ 2019</p>
        </footer>
      </div>
    );
  }
}

export default App;
