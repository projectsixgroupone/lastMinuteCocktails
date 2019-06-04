import React, { Component } from 'react'

export default class Recipe extends Component {
    render() {
        return (
            <div>
                <p>{this.props.name}</p>
            </div>
        )
    }
}
