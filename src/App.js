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
      myDrinkRecipes: []
    }
  }

  login = () => {
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        const displayName = user.displayName;
        let myFavouriteDrinks = [];
        const dbref = firebase.database().ref(`users/${user.uid}`);
        // console.log(`THIS IS DBREF: `, dbref);
        dbref.on('value', (snapshot) => {
          myFavouriteDrinks = []
          // console.log(`this is snapshot: `, snapshot.val());
          if (snapshot.val() === null) {
            dbref.set({
              userid: user.uid,
              displayName: displayName,

            });
            // console.log(user);
            // console.log(displayName);
          } else { 
            let favouriteObj = snapshot.val().favouriteDrinks
            console.log(favouriteObj)
            for (let key in favouriteObj) {
              console.log(favouriteObj[key])
              if (favouriteObj[key].favourite === true) {
                myFavouriteDrinks.push(key)
                console.log(myFavouriteDrinks)
              }
            }
          }
          this.setState({
            user,
            displayName,
            myFavouriteDrinks
          });
        })
      });
  }

  logout = () => {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null,
          displayName: null
        });
      });
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
 
  getFilteredDrinks = (choiceDrink) => {
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
   

  // narrowItDown = filteredDrinkName => {
  //   const copyOfDrinkRecipes = Array.from(this.state.drinkRecipes);
  //   console.log(copyOfDrinkRecipes);
  // };

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
      // console.log(results)

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
    console.log(results)

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
        // console.log(`THIS IS DBREF: `, dbref);
        dbref.on('value', (snapshot) => {
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
  if (this.state.filteredDrinks.length > 0){
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
