import React, { Component } from 'react';
import Recipe from './Recipe.js'



export default class RecipeList extends Component {
    ingredientList = (recipe) => {
        let ingredientArray = [];
        let measureArray = [];
        for (let i=1;i<16;i++) {
            let strIngredient = "strIngredient" + i;
            let strMeasure = "strMeasure" + i;
            if (recipe[strIngredient] !== "") {
            ingredientArray.push(recipe[strIngredient]);
            measureArray.push(recipe[strMeasure]);
            }
        }
        let ingredientAndMeasurement = {
            ingredient: ingredientArray,
            measure: measureArray
        }
        return ingredientAndMeasurement;
    }

    render() { 
        return (
            <div className="recipesContainer">
                {this.props.drinkRecipes.map((recipe) => {
                        let ingredientArray = this.ingredientList(recipe);
                        return (
                            <Recipe
                                key={recipe.idDrink}
                                name={recipe.strDrink}
                                thumbnail={recipe.strDrinkThumb}
                                ingredients={ingredientArray}
                                instructions={recipe.strInstructions}
                            />
                        )
                        console.log(ingredientArray);
                    })
                }
            </div>
        )
    }
}
