import React, { Component } from 'react'

export default class Recipe extends Component {
    render() {
        return (
            <div>
                <p>{this.props.name}</p>
                <img src={this.props.thumbnail} alt={this.props.name} />
                <p>{this.props.instructions}</p>

            </div>
        )
    }
}
