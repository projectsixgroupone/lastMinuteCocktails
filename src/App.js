import React, {Component} from 'react';
import './App.scss';
import firebase from './firebase.js';
import Form from './Form.js'
import axios from 'axios'
import RecipeList from './RecipeList.js';

const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

class App extends Component {
  constructor() {
    super();

    this.state = {
      drinkRecipes: [],
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
      // console.log(results)

      this.setState({
        drinkRecipes: results.flat()
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

    // const dbrefUsers = firebase.database().ref('users');
    // dbrefUsers.on('value', (response) => {
    //   let drinks = response.val()
    //   let myFavouriteDrinks = []
    //   drinks = Object.entries(drinks)
    //   drinks.map(drink => {
    //     if (drink[1].favourite === true) {
    //       myFavouriteDrinks.push(drink[0])
    //     }
    //   })
    //   this.setState({ myFavouriteDrinks })
    //   console.log({ myFavouriteDrinks })
    //   }
    // )
  }



  render() {
    return (
      <div>
       <header>
          <h1>Last Minute Cocktail Generator</h1>
          <h2>Look Up Any Cocktail In Our Database</h2>
          <Form error={this.state.error} handlerFromParent={this.handleInput}/>
          <button onClick={this.getFavouriteDrinks} className="favouriteDrinks" aria-label="Favourite Drinks">Favourite Drinks</button>

          {/* LOGIN/LOGOUT BUTTONS */}

          {this.state.user ? <button onClick={this.logout} user={this.state.user}>Log Out</button> : <button onClick={this.login}>Log In</button>}
          {this.state.user ? <button onClick={this.getMyFavouriteDrinks} className="myFavouriteDrinks" aria-label="My Favourite Drinks" >My Favourite Drinks</button> : <button></button>}
          {this.state.displayName ? <h3>Welcome, {this.state.displayName}</h3> : <h3></h3>}
        </header>

        <div className="results">
          <RecipeList drinkRecipes={this.state.drinkRecipes} user={this.state.user} myFavouriteDrinks={this.state.myFavouriteDrinks} favouriteDrinks={this.state.favouriteDrinks} />
        </div>

        <footer>
          <p>Copyright Ⓒ 2019</p>
        </footer>

      </div>

    );
  }
}

export default App;
