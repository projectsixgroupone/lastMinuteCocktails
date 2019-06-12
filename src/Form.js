import React, { Component } from 'react'


class Form extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
      

    }
  }
  // handle the change in state
  onChange = (event) => {
    this.setState({
      value: event.target.value
    })
  }
  // on submit call the api with handler passed as a prop from the parent
  onSubmit = (event) => {
    event.preventDefault()
    this.props.handlerFromParent(this.state.value)
  }

  render() {
    return (

      <form className ="mainForm wrapper" action="submit" onSubmit={this.onSubmit}>
        <div className="searchContainer">
            <input type="text" aria-label="Type search here" onChange={this.onChange} placeholder="Cocktail Name" />
            {this.props.error === true ? <p>Your search returned no results.</p> : null}
        </div>
        <div className="searchButtonContainer">
            <button className="mainButton" aria-label="search">Search</button>
        </div>

      </form>
    );
  }
}

export default Form 



