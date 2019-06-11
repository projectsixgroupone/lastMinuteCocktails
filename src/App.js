import React, {Component} from 'react';
import './App.scss';
import firebase from './firebase.js';
import Form from './Form.js'
import axios from 'axios'
import RecipeList from './RecipeList.js';
import Dropdown from "./Dropdown.js";

// setup firebase auth
const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

class App extends Component {
  constructor() {
    super();
    this.myRef = React.createRef();
    this.state = {
      drinkRecipes: [],
      filteredDrinks:[],
      error: false,
      savedList: {},
      favouriteDrinks: [],
      user: null,
      displayName: null,
      myFavouriteDrinks: [],
      myDrinkRecipes: [],
      emptyFilter: false
    }
  }

  // On login click connect to firebase
  login = () => {
    auth.signInWithPopup(provider)
      .then((result) => {

        // save the result and firebase reference to variables
        const user = result.user;
        const displayName = user.displayName;
        let myFavouriteDrinks = [];
        const dbref = firebase.database().ref(`users/${user.uid}`);

        // get a snapshot of the database
        dbref.on('value', (snapshot) => {
          myFavouriteDrinks = []
          // if the use doesn't exist in firebase, add them
          if (snapshot.val() === null) {
            dbref.set({
              userid: user.uid,
              displayName: displayName,

            });
            // otherwise get the values of the user's favorited drinks
          } else { 
            let favouriteObj = snapshot.val().favouriteDrinks
            for (let key in favouriteObj) {
              if (favouriteObj[key].favourite === true) {
                myFavouriteDrinks.push(key)
              }
            }
          }
          // save the user, name, and favourited drinks to state
          this.setState({
            user,
            displayName,
            myFavouriteDrinks
          });
        })
      });
  }
  // on logout click, log the user out
  logout = () => {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null,
          displayName: null
        });
      });
  }

  // handles the user input on the main search bar. If the input is valid, it calls the API. If not, it sets an error in state.
  handleInput = drink => {
    if (drink) {
      this.getDrinks(drink);
      this.setState({
        filteredDrinks: [],
        emptyFilter: false
      })
    } else {
      this.setState({
        error: true,
        drinkRecipes: []

      });
    }
  };
  // Get filtered drinks from 
  getFilteredDrinks = (choiceDrink) => {
    this.setState({
      emptyFilter: false,
    })
    if (choiceDrink !== `all`) {
      const filteredDrinks = this.state.drinkRecipes.filter(item => {
        // if the user choice "Alcoholic" drinks then we push those items in here
        // else they chose, nonalcoholic
        return item.strAlcoholic === choiceDrink;
      });
      if (filteredDrinks.length === 0) {
        this.setState({
          emptyFilter: true,
        })
      }
      this.setState({
        filteredDrinks: filteredDrinks,
      })
    } else {
      this.setState({
        filteredDrinks: this.state.drinkRecipes,
        emptyFilter: false
      })
    }
  };
  
  // API call takes user input as a query
  getDrinks = drink => {
    const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php";
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

      this.setState({
        drinkRecipes: results.flat(),
        filteredDrinks: []
      })
  }

  getMyFavouriteDrinks = async () => {
    const url = ` https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=11007`
    let myFavouriteDrinks = [...this.state.myFavouriteDrinks]

    let myFavouriteDrinksRequests = myFavouriteDrinks.map(async id => {
      const response = await axios.get(url, {
        dataResponse: 'json',
        params: {
          i: id
        }
      })
      return response.data.drinks
    })
    const results = await Promise.all(myFavouriteDrinksRequests)

    this.setState({
      drinkRecipes: results.flat()
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
    auth.onAuthStateChanged((user) => {
      if (user) {
        let myFavouriteDrinks = [];
        const dbref = firebase.database().ref(`users/${user.uid}`);
        dbref.on('value', (snapshot) => {
          if (snapshot.val() !== null) {
            myFavouriteDrinks = []
            let favouriteObj = snapshot.val().favouriteDrinks
            for (let key in favouriteObj) {
              if (favouriteObj[key].favourite === true) {
                myFavouriteDrinks.push(key)
              }
            }
            this.setState({
              user,
              displayName: user.displayName,
              myFavouriteDrinks
            });
          }
          
        })
      }
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
  if (this.state.emptyFilter) {
    drinkRecipes = []
  } else if (this.state.filteredDrinks.length > 0){
    drinkRecipes = this.state.filteredDrinks;
  }
    return (
      <div>
        <header>
          <nav>
            <div className="wrapper">
            {this.state.user ? <button onClick={this.getMyFavouriteDrinks} className="favouriteDrinks" aria-label="My Favourite Drinks" >My Favourite Drinks</button> : <button onClick={this.getFavouriteDrinks} className="favouriteDrinks" aria-label="Favourite Drinks">Favourite Drinks</button>}
              <div>
                {this.state.displayName && <p>Welcome, {this.state.displayName}</p>}
                {this.state.user ? <button className="favouriteDrinks" onClick={this.logout} user={this.state.user}>Log Out</button> : <button className="favouriteDrinks" onClick={this.login}>Log In</button>}
              </div>  
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
            user={this.state.user}
            displayName={this.state.displayName} 
            myFavouriteDrinks={this.state.myFavouriteDrinks} 
            favouriteDrinks={this.state.favouriteDrinks}
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
