import React, { Component, Fragment } from 'react';
import firebase from './firebase.js';
import { all } from 'q';



export default class Recipe extends Component {
  constructor() {
    super()
    this.state = {
      note: '',
      rating: null,
      totalRating: [],
      averageRating: null,
      allNotes: [],
      expand: false
    }
  }

  onExpand= (event) =>{
    this.setState({
      expand: true
    })
  }
  onShrink= (event) =>{
    this.setState({
      expand: false
    })
  }

  onChange = (event) => {
    this.setState({
      note: event.target.value
    })
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.props.addNote(this.props.id, this.state.note)
    // this.props.handlerFromParent(this.state.value)
  }

  onRating = (event) => {
    const ratings = this.state.totalRating;
    ratings.push(parseInt(event.target.value))

    this.setState({
      rating: event.target.value,
      totalRating: ratings

    })
    this.props.addRating(this.props.id, ratings)
    console.log(ratings)
  }


  componentDidMount() {

    // const dbref = firebase.database().ref();
    const dbref = firebase.database().ref('drinks/' + this.props.id);

    dbref.on('value', (response) => {
      // console.log(response.val() );
      if (response.val() === null) {
        dbref.update({
          favourite: false
        })
      } else {
        if (response.val().notes) {
          const notes = response.val().notes;
          const newNotes = [];
          for (let key in notes) {
            newNotes.push(notes[key].note)
          }
          console.log(notes);
          console.log(newNotes);
          this.setState({
            allNotes: newNotes,
          })
        }
        if (response.val().rating) {
          const ratings = response.val().rating
          let averageRating = ratings.reduce((total, rating) => total + rating) / ratings.length;
          averageRating = Math.round(averageRating)
          this.setState({
            totalRating: response.val().rating,
            averageRating: averageRating,
            rating: averageRating
          })
        }
      }
    })
  }


  // Takes each result from the search bar and displays the name, thumbnail and instructions relating to the drink
  // Favourite button stores the drink based on the drink's property: id
  render() {
    const expandContent = () =>{
      if (this.state.expand) {
        return(
          <div>
           
            <img src={this.props.thumbnail} alt={this.props.name} />
            <h2>{this.props.name}</h2>


            <div className="rating">
              <input onClick={this.onRating}
                type="radio"
                id={'starFive' + this.props.id}
                name={'rating' + this.props.id}
                checked={this.state.rating === 5}
                value="5"
              />
              <label
                className="star"
                htmlFor={'starFive' + this.props.id}
                title="Awesome"
                aria-hidden="true"
              />
              <input onClick={this.onRating}
                type="radio"
                id={'starFour' + this.props.id}
                name={'rating' + this.props.id}
                checked={this.state.rating === 4}
                value="4"
              />
              <label
                className="star"
                htmlFor={'starFour' + this.props.id}
                title="Great"
                aria-hidden="true"
              />
              <input onClick={this.onRating}
                type="radio"
                id={'starThree' + this.props.id}
                name={'rating' + this.props.id}
                checked={this.state.rating === 3}
                value="3"
              />
              <label
                className="star"
                htmlFor={'starThree' + this.props.id}
                title="Very good"
                aria-hidden="true"
              />
              <input onClick={this.onRating}
                type="radio"
                id={'starTwo' + this.props.id}
                name={'rating' + this.props.id}
                checked={this.state.rating === 2}
                value="2"
              />
              <label
                className="star"
                htmlFor={'starTwo' + this.props.id}
                title="Good"
                aria-hidden="true"
              />
              <input onClick={this.onRating}
                type="radio"
                id={'starOne' + this.props.id}
                name={'rating' + this.props.id}
                checked={this.state.rating === 1}
                value="1"
              />
              <label
                className="star"
                htmlFor={'starOne' + this.props.id}
                title="Bad"
                aria-hidden="true"
              />
              {/* <span>{this.state.averageRating}</span> */}
            </div>

            <h3>Instructions</h3>
            <p>{this.props.instructions}</p>

            <h3>Ingredients</h3>
            <p>{this.props.ingredients.ingredient}</p>

            {this.props.ingredients.map((ingredient) => {
              return (
                <li>{ingredient.measurement} {ingredient.ingredient}</li>
              )
            })}



            <button onClick={() => this.props.storeDrink(this.props.id)}>Favourite This Drink</button>
            <form action="submit" onSubmit={this.onSubmit}>
              <textarea onChange={this.onChange} />
              <button>Add Note</button>
            </form>

            <div className="notes">
              {this.state.allNotes.map(note => {
                return (
                  <p>{note}</p>
                )
              })}
            </div>
            <button onClick={this.onShrink} className="readMore">
              minimize
            </button>
          </div>
        )
      } else {
        return(
          <div className="resultDisplay">

        <img src={this.props.thumbnail} alt={this.props.name} />
        <div className="drinkInfo">
          <h2>{this.props.name}</h2>
          <p>{this.props.instructions}</p>
          <button onClick={() => this.props.storeDrink(this.props.id)}>Favourite This Drink</button>
        
          <div className="rating">
            <input onClick={this.onRating}
              type="radio"
              id={'starFive' + this.props.id}
              name={'rating' + this.props.id}
              checked={this.state.rating === 5}
              value="5"
            />
            <label
              className="star"
              htmlFor={'starFive' + this.props.id}
              title="Awesome"
              aria-hidden="true"
            />
            <input onClick={this.onRating}
              type="radio"
              id={'starFour' + this.props.id}
              name={'rating' + this.props.id}
              checked={this.state.rating === 4}
              value="4"
            />
            <label
              className="star"
              htmlFor={'starFour' + this.props.id}
              title="Great"
              aria-hidden="true"
            />
            <input onClick={this.onRating}
              type="radio"
              id={'starThree' + this.props.id}
              name={'rating' + this.props.id}
              checked={this.state.rating === 3}
              value="3"
            />
            <label
              className="star"
              htmlFor={'starThree' + this.props.id}
              title="Very good"
              aria-hidden="true"
            />
            <input onClick={this.onRating}
              type="radio"
              id={'starTwo' + this.props.id}
              name={'rating' + this.props.id}
              checked={this.state.rating === 2}
              value="2"
            />
            <label
              className="star"
              htmlFor={'starTwo' + this.props.id}
              title="Good"
              aria-hidden="true"
            />
            <input onClick={this.onRating}
              type="radio"
              id={'starOne' + this.props.id}
              name={'rating' + this.props.id}
              checked={this.state.rating === 1}
              value="1"
            />
            <label
              className="star"
              htmlFor={'starOne' + this.props.id}
              title="Bad"
              aria-hidden="true"
            />
            {/* <span>{this.state.averageRating}</span> */}

          </div>
          <button onClick={this.onExpand} className="readMore">
            read more
          </button>

        </div>
      </div>
        )
      }
    }

    return (
      <Fragment>
        {expandContent()}
      </Fragment>
    );
  }
}
