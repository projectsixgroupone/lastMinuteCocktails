import React, { Component } from 'react';
import firebase from './firebase.js';



export default class Recipe extends Component {
    render() {
        return (
            <div>
                <p>{this.props.name}</p>
                <img src={this.props.thumbnail} alt={this.props.name} />
                <p>{this.props.instructions}</p>
                <button onClick={() => this.props.storeDrink(this.props.id)}>Favourite This Drink</button>

            </div>
        )
    }
}
