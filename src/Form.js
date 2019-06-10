import React, { Component } from 'react'


class Form extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
      

    }
  }

  onChange = (event) => {
    this.setState({
      value: event.target.value
    })
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.props.handlerFromParent(this.state.value)
  }

  render() {
    return (

      <form className ="mainForm wrapper" action="submit" onSubmit={this.onSubmit}>
        <div className="searchContainer">
            <input type="text" aria-label="Type search here" onChange={this.onChange} />
            {this.props.error === true ? <p>your search returned no results</p> : null}
        </div>
        <div className="searchButtonContainer">
            <button className="mainButton" aria-label="search">Search</button>
        </div>

      </form>
    );
  }
}

export default Form 