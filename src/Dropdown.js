import React, { Component } from "react";

class Dropdown extends Component {
constructor(){
    super();
    this.state={
        choice:'',
    }
}

handleChange = (e) => {
    console.log(`handleChange`, e.target.value)
    this.setState({
        choice: e.target.value
    })
}


  render() {
    return (
      <form action="submit">
        <select
          onChange={this.handleChange}
          name="filteredDrinkName"
          id="strAlcoholic"
        >
          <option value="All">All Drinks</option>
          <option value="Alcoholic">Alcoholic</option>
          <option value="Non alcoholic">Non-Alcoholic</option>
        </select>{" "}
        <button
          onClick={e => this.props.getFilteredDrinks(e, this.state.choice)}
        >
          BUTTON
        </button>
      </form>
    );
  }
}

export default Dropdown;
