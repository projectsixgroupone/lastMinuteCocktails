import React, { Component } from 'react';
import Recipe from './Recipe.js';
import firebase from './firebase';

// We now have an array of drinks that include the id "strAlcoholic"
// We want to target that id for all the drinks,  using either map or for each
// Push the results of the array, after using a method, to state
// After a checkbox is clicked in a drop down menu, show the results onto the page.

export default class RecipeList extends Component {

  ingredientList = (recipe) => {
    // The api stores ingredients with up to 15 different keys for each the ingredient name and measurement, this function converts that format to an array of objects that is much easier to work with.
    // Arrays to store the ingredients and coressponding measurements of each drink in results
    let ingredientArray = [];
  
    // Loops through the 15 ingredients and measurements listed in the object and pushes the populated ones into the array. 
    for (let i = 1; i < 16; i++) {
      let strIngredient = "strIngredient" + i;
      let strMeasure = "strMeasure" + i;
      if (recipe[strIngredient] !== "") {
        ingredientArray.push({ ingredient: recipe[strIngredient], measurement: recipe[strMeasure]});
        
      }
    }
    return ingredientArray;
  }

  // favouriteDrink and unfavourite are methods that takes the id of a resulting drink and stores it to the firebase database. 
  favouriteDrink = (drinkId) => {
    const dbref = firebase.database().ref('drinks/' + drinkId);
    dbref.update({
      favourite: true
    })
  }
  unfavouriteDrink = (drinkId) => {
    const dbref = firebase.database().ref('drinks/' + drinkId);
    dbref.update({
      favourite: false
    })
  }

  // handles the favourite buttons
  handleFavourites = (id) => {
    // If user is logged in update their user favorites otherwise update the general drink info in firebase
    if (this.props.user) {
      const dbref = firebase.database().ref(`users/${this.props.user.uid}/favouriteDrinks/${id}`);
      
      const myExistingFavourites = [...this.props.myFavouriteDrinks]
      if (myExistingFavourites.indexOf(id) > -1) {
        dbref.update({
          favourite: false
        })
      } else {
        dbref.update({
          favourite: true
        })
      }
    
      
      
    } else {
      const existingFavourites = [...this.props.favouriteDrinks]
      if (existingFavourites.indexOf(id) > -1) {
        this.unfavouriteDrink(id);
      } else {
        this.favouriteDrink(id);
      }
    }
    

  }
  // add new notes to firebase
  addNote = (drinkId, note, name) => {
    const dbref = firebase.database().ref('drinks/' + drinkId + '/notes');
    dbref.push({ note, name })
  }
  // add new rating to firebase 
  addRating = (drinkId, rating) => {
    const dbref = firebase.database().ref('drinks/' + drinkId);
    dbref.update({ rating })
  }

  // render method maps through the array of drink recipes and creates recipe component with each of the properties in the array conditional render that shows filtered drinks, if the length is greater than zero show it, but if tehere's nothing then iterate over
  render() {

    return (
      <div className="recipesContainer wrapper" ref={this.myRef}>
        {this.props.drinkRecipes.map((recipe) => {
          let ingredientArray = this.ingredientList(recipe);
          let favourite = false;
          const myExistingFavourites = [...this.props.myFavouriteDrinks]
          const existingFavourites = [...this.props.favouriteDrinks]
          // if the the drink is favorited pass the value of true to the child
          if ((this.props.user && myExistingFavourites.indexOf(recipe.idDrink) > -1) || (!this.props.user && existingFavourites.indexOf(recipe.idDrink) > -1 )) {
            favourite = true
          } 
          
          return (
            <Recipe
              key={recipe.idDrink}
              name={recipe.strDrink}
              thumbnail={recipe.strDrinkThumb}
              ingredients={ingredientArray}
              instructions={recipe.strInstructions}
              favourite={favourite}
              displayName={this.props.displayName}
              addNote={this.addNote}
              id={recipe.idDrink}
              addRating={this.addRating}
              handleFavourites={this.handleFavourites}
            />

          )
        })
        }
      </div>
    )
  }
}
