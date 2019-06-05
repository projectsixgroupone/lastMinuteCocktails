import React, { Component } from 'react';
import firebase from './firebase.js';



export default class Recipe extends Component {
    constructor() {
        super()
        this.state ={
            note: '',
            rating: null, 
            totalRating: []
        }
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

    onRating =(event)=> {
      const ratings = this.state.totalRating;
      ratings.push(parseInt(event.target.value))

        this.setState({
          rating: event.target.value,
          totalRating:ratings
            
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
            // this.setState = {
            //     totalRating: response.val()
            // }
            // console.log(response.val().rating)
            if (response.val().rating) {
                this.setState ({
                    totalRating: response.val().rating
                })
            }
        }
      })
    }
    // Takes each result from the search bar and displays the name, thumbnail and instructions relating to the drink
    // Favourite button stores the drink based on the drink's property: id
    render() {
        return (
          <div>
            <p>{this.props.name}</p>
            <img src={this.props.thumbnail} alt={this.props.name} />
            <p>{this.props.instructions}</p>
            <button
              onClick={() => this.props.storeDrink(this.props.id)}
            >
              Favourite This Drink
            </button>
            <form action="submit" onSubmit={this.onSubmit}>
              <textarea onChange={this.onChange} />
              <button>Add Note</button>
            </form>
            
              <div className="rating">
                <input onClick = {this.onRating}
                  type="radio"
                  id="star5"
                  name="rating"
                  value="5"
                />
                <label
                  className="star"
                  htmlFor="star5"
                  title="Awesome"
                  aria-hidden="true"
                />
              <input onClick = {this.onRating}
                  type="radio"
                  id="star4"
                  name="rating"
                  value="4"
                />
                <label
                  className="star"
                  htmlFor="star4"
                  title="Great"
                  aria-hidden="true"
                />
              <input onClick={this.onRating}
                  type="radio"
                  id="star3"
                  name="rating"
                  value="3"
                />
                <label
                  className="star"
                  htmlFor="star3"
                  title="Very good"
                  aria-hidden="true"
                />
              <input onClick={this.onRating}
                  type="radio"
                  id="star2"
                  name="rating"
                  value="2"
                />
                <label
                  className="star"
                  htmlFor="star2"
                  title="Good"
                  aria-hidden="true"
                />
              <input onClick={this.onRating}
                  type="radio"
                  id="star1"
                  name="rating"
                  value="1"
                />
                <label
                  className="star"
                  htmlFor="star1"
                  title="Bad"
                  aria-hidden="true"
                />
              </div>
            
          </div>
        );
    }
}
