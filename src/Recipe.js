import React, { Component, Fragment } from 'react';
import firebase from './firebase.js';

export default class Recipe extends Component {
  constructor() {
    super()
    this.state = {
      note: '',
      noteName: '',
      rating: null,
      totalRating: [],
      averageRating: null,
      allNotes: [],
      noteError: false,
      expand: false,
    }
    this.myRef = React.createRef()
  }
  // when the user clicks expand, set it in state and scroll to the box
  onExpand= (event) =>{
    this.setState({
      expand: true
    }, () => {
      this.myRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "start",
        inline: "nearest"
      })
    })
  }
  
  // when the user clicks shrink, set it in state and scroll to the box
  onShrink= (event) =>{
    this.setState({
      expand: false
    }, () => {
      this.myRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "nearest"
      })
    })
  }

  // handle change in note box
  onChange = (event) => {
    this.setState({
      note: event.target.value
    })
  }

  // handle change in note name input
  onNameChange = (event) => {
    this.setState({
      noteName: event.target.value
    })
  }

  // submit the note
  onSubmit = (event) => {
    event.preventDefault()
    this.setState({
      noteError: false
    })
    // if note is valid call the add note function in the parent, otherwise show an error
    if(this.state.note !== '') {
      this.props.addNote(this.props.id, this.state.note, this.state.noteName)
    } else {
      this.setState({
        noteError: true
      })

    }
  }

  // when the user rates a drink push it into the array of ratings in state
  onRating = (event) => {
    const ratings = [...this.state.totalRating];
    ratings.push(parseInt(event.target.value))

    this.setState({
      rating: parseInt(event.target.value),
      totalRating: ratings

    })
    this.props.addRating(this.props.id, ratings)
  }

  // handle the rating input
  handleRating = (event) => {
    this.setState({
      rating: parseInt(event.target.value),
    })
  }

  
  componentDidMount() {
    // when the component mounts default the note name input to the user name
    if (this.props.displayName) {
      this.setState({
        noteName: this.props.displayName,
      })
    }
    
    // if the drink doesn't exist in firebase add it with favourite state of false
    // if it does exist get the notes ratings, and favourite status and save it in state
    const dbref = firebase.database().ref('drinks/' + this.props.id);
    dbref.on('value', (response) => {
      if (response.val() === null) {
        dbref.update({
          favourite: false
        })
      } else {
        if (response.val().notes) {
          const notes = response.val().notes;
          const newNotes = [];
          for (let key in notes) {
            newNotes.push({note: notes[key].note, name: notes[key].name})
          }
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
        if (response.val().favourite) {
          this.setState({
            favourited: true,
          })
        } else { 
          this.setState({
            favourited: false,
          })
        }
      }
    })
  }


  
  // Render shows either and expanded or minimized version of the recipe depending on state.
  render() {

    const expandContent = () =>{
      if (this.state.expand) {
        return(
          <div className="recipeBox expanded" ref={this.myRef}>
            <div className="imgAndRating">
              <img src={this.props.thumbnail} alt={this.props.name} />

              <div className="ratingContainer">
                <div className="rating">
                  <input onChange={this.handleRating}
                    onClick={this.onRating}
                    type="radio"
                    id={'starFive' + this.props.id}
                    name={'rating' + this.props.id}
                    checked={this.state.averageRating === 5}
                    value="5"
                  />
                  <label
                    className="star"
                    htmlFor={'starFive' + this.props.id}
                    title="Awesome"
                    aria-hidden="true"
                  />
                  <input onChange={this.handleRating}
                    onClick={this.onRating}
                    type="radio"
                    id={'starFour' + this.props.id}
                    name={'rating' + this.props.id}
                    checked={this.state.averageRating === 4}
                    value="4"
                  />
                  <label
                    className="star"
                    htmlFor={'starFour' + this.props.id}
                    title="Great"
                    aria-hidden="true"
                  />
                  <input onChange={this.handleRating}
                    onClick={this.onRating}
                    type="radio"
                    id={'starThree' + this.props.id}
                    name={'rating' + this.props.id}
                    checked={this.state.averageRating === 3}
                    value="3"
                  />
                  <label
                    className="star"
                    htmlFor={'starThree' + this.props.id}
                    title="Very good"
                    aria-hidden="true"
                  />
                  <input onChange={this.handleRating}
                    onClick={this.onRating}
                    type="radio"
                    id={'starTwo' + this.props.id}
                    name={'rating' + this.props.id}
                    checked={this.state.averageRating === 2}
                    value="2"
                  />
                  <label
                    className="star"
                    htmlFor={'starTwo' + this.props.id}
                    title="Good"
                    aria-hidden="true"
                  />
                  <input onChange={this.handleRating}
                    onClick={this.onRating}
                    type="radio"
                    id={'starOne' + this.props.id}
                    name={'rating' + this.props.id}
                    checked={this.state.averageRating === 1}
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
                <div className="ratingCount"><p>{this.state.totalRating.length} ratings</p></div>
              </div>
              <button onClick={this.onShrink} className="readMore less">
                Show Less
              </button>

              {this.props.favourite ? <button className="favouriteButton unfavourite" onClick={()=> this.props.handleFavourites(this.props.id)}><i className="fas fa-heart"></i></button> : <button className="favouriteButton" onClick={()=> this.props.handleFavourites(this.props.id)}><i className="fas fa-heart"></i></button>}

            </div>

            
            <div className="moreDetails">
              <h2>{this.props.name}</h2>
              <div className="ingredientsInstructions">
              <div className="ingredients">
                <h3 tabIndex="0">Ingredients</h3>
                <p>{this.props.ingredients.ingredient}</p>

                  <ul tabIndex="0">{this.props.ingredients.map((ingredient, index) => {
                  return (
                    <li key={index}>{ingredient.measurement} {ingredient.ingredient}</li>
                  )
                })}</ul>
              </div>
                <div className="instructions">
                  <h3>Instructions</h3>
                  <p>{this.props.instructions}</p>
                </div>
              </div>

              <div className="noteSection">
                <h3 tabIndex="0">Notes</h3>
                <div className="notes">
                  {this.state.allNotes.map((note, index) => {
                    return (
                      <p key={index} tabIndex="0"><span className="noteName">{note.name ? note.name : 'Guest'}:</span> {note.note}</p>
                    )
                  })}
                </div>
                <form action="submit" onSubmit={this.onSubmit}>
                  <input type="text" onChange={this.onNameChange} placeholder="Name"
                  value={this.state.noteName} />
                  <textarea onChange={this.onChange} placeholder="Enter your note..." tabIndex="0" aria-label="Enter Your Note Here"/>
                  <div>{this.state.noteError ? <p className="noteError">Did you forget to add your comment?</p> :  null }</div>
                  <button className="addNote">Add Note</button>
                </form>
              </div>
              

              
            </div>

            
          </div>
        )
      } else {
        return(
          <div className="recipeBox" ref={this.myRef}>
            <img src={this.props.thumbnail} alt={this.props.name} tabIndex="0" />
            <div className="drinkInfo">
              <h2 aria-label={this.props.name}>{this.props.name}</h2>

                  <div className="rating">
                    <input onChange={this.handleRating}
                    onClick={this.onRating}
                      type="radio"
                      id={'starFive' + this.props.id}
                      name={'rating' + this.props.id}
                      checked={this.state.averageRating === 5}
                      value="5"
                    />
                    <label
                      className="star"
                      htmlFor={'starFive' + this.props.id}
                      title="Awesome"
                      aria-hidden="true"
                    />
                    <input onChange={this.handleRating}
                    onClick={this.onRating}
                      type="radio"
                      id={'starFour' + this.props.id}
                      name={'rating' + this.props.id}
                      checked={this.state.averageRating === 4}
                      value="4"
                    />
                    <label
                      className="star"
                      htmlFor={'starFour' + this.props.id}
                      title="Great"
                      aria-hidden="true"
                    />
                    <input onChange={this.handleRating}
                    onClick={this.onRating}
                      type="radio"
                      id={'starThree' + this.props.id}
                      name={'rating' + this.props.id}
                      checked={this.state.averageRating === 3}
                      value="3"
                    />
                    <label
                      className="star"
                      htmlFor={'starThree' + this.props.id}
                      title="Very good"
                      aria-hidden="true"
                    />
                    <input onChange={this.handleRating}
                    onClick={this.onRating}
                      type="radio"
                      id={'starTwo' + this.props.id}
                      name={'rating' + this.props.id}
                      checked={this.state.averageRating === 2}
                      value="2"
                    />
                    <label
                      className="star"
                      htmlFor={'starTwo' + this.props.id}
                      title="Good"
                      aria-hidden="true"
                    />
                    <input onChange={this.handleRating}
                    onClick={this.onRating}
                      type="radio"
                      id={'starOne' + this.props.id}
                      name={'rating' + this.props.id}
                      checked={this.state.averageRating === 1}
                      value="1"
                    />
                    <label
                      className="star"
                      htmlFor={'starOne' + this.props.id}
                      title="Bad"
                      aria-hidden="true"
                    />
                  </div>

              <p tabIndex="0">{this.props.instructions.length > 125 ? this.props.instructions.substring(0,122)+"..." : this.props.instructions }</p>

                {this.props.favourite ? <button className="favouriteButton unfavourite" onClick={()=> this.props.handleFavourites(this.props.id)}><i className="fas fa-heart"></i></button> : <button className="favouriteButton" onClick={()=> this.props.handleFavourites(this.props.id)}><i className="fas fa-heart"></i></button>}
              
              <button onClick={this.onExpand} className="readMore" aria-label="read more">
                Read More
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
