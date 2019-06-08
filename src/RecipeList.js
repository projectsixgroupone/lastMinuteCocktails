import React, { Component } from 'react';
import Recipe from './Recipe.js';
import firebase from './firebase';



export default class RecipeList extends Component {
  constructor() {
    super();
    this.myRef = React.createRef();
  }
  ingredientList = (recipe) => {
    // Arrays to store the ingredients and coressponding measurements of each drink in results
    let ingredientArray = [];
  
    // Loops through the 15 ingredients and measurements listed in the object and pushes the populated ones into the array. The measurements Array contains the corresponding amount even if it's blank
    for (let i = 1; i < 16; i++) {
      let strIngredient = "strIngredient" + i;
      let strMeasure = "strMeasure" + i;
      if (recipe[strIngredient] !== "") {
        ingredientArray.push({ ingredient: recipe[strIngredient], measurement: recipe[strMeasure]});
        
      }
    }
    // stores both ingredient and measurement arrays into one object to be returned and used in the render method
    
    return ingredientArray;
  }

  // favouriteDrink is a method that takes the id of a resulting drink and stores it to the firebase database. When stored, the ids are all stored under 1 parent, and each contain a child specifying if it's favourited
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
  addNote = (drinkId, note, name) => {
    const dbref = firebase.database().ref('drinks/' + drinkId + '/notes');
    dbref.push({ note, name })
  }

  addRating = (drinkId, rating) => {
    const dbref = firebase.database().ref('drinks/' + drinkId);
    dbref.update({ rating })
  }


  // When a value is updated, retrieves the information from firebase
  componentDidMount() {
    const dbref = firebase.database().ref();
    dbref.on('value', (response) => {
      // console.log(response.val());

    })
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.drinkRecipes !== this.props.drinkRecipes) {
      this.myRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "start"
      })
    }
  }

  // render method maps through the array of drink recipes and creates recipe component with each of the properties in the array

  render() {
    return (
      <div className="recipesContainer wrapper" ref={this.myRef}>

        {this.props.drinkRecipes.map((recipe) => {
          let ingredientArray = this.ingredientList(recipe);
          return (
            <Recipe
              key={recipe.idDrink}
              name={recipe.strDrink}
              thumbnail={recipe.strDrinkThumb}
              ingredients={ingredientArray}
              instructions={recipe.strInstructions}
              favouriteDrink={this.favouriteDrink}
              unfavouriteDrink={this.unfavouriteDrink}
              addNote={this.addNote}
              id={recipe.idDrink}
              addRating={this.addRating}

            />

          )
        })
        }
      </div>
    )
  }
}
