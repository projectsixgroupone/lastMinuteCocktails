import React, { Component } from 'react';
import firebase from './firebase.js';



export default class Recipe extends Component {
    constructor() {
        super()
        this.state ={
            note: ''
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

    // Takes each result from the search bar and displays the name, thumbnail and instructions relating to the drink
    // Favourite button stores the drink based on the drink's property: id
    render() {
        return (
            <div>
                <p>{this.props.name}</p>
                <img src={this.props.thumbnail} alt={this.props.name} />
                <p>{this.props.instructions}</p>
                <button onClick={() => this.props.storeDrink(this.props.id)}>Favourite This Drink</button>
                <form action="submit" onSubmit ={this.onSubmit}>
                    <textarea onChange={this.onChange}></textarea>
                    <button>Add Note</button>
                </form>

            </div>
        )
    }
}
