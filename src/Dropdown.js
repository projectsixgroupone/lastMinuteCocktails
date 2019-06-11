import React, { Component } from "react";

class Dropdown extends Component {
constructor(){
    super();
    this.state={
        choice: ''
    }
}

handleChange = (e) => {
    console.log(`handleChange`, e.target.value)
    this.setState({
        choice: e.target.value
    })
    this.props.getFilteredDrinks(e.target.value)
}

  // onChange = { this.handleChange }

  render() {
    return (
    
        <form class="searchCategories">
          <div className="categoriesContainer wrapper">
            <p><i class="fas fa-filter"></i>Filter By:</p>
            <input onChange={this.handleChange}
              type="radio"
              id="all"
              name="filteredDrinkName"
              value="all"
              // aria-hidden="true"
            />
            <label htmlFor="all">All</label>

            <input onChange={this.handleChange}
              type="radio"
              id="alcoholic"
              name="filteredDrinkName"
              value="Alcoholic"
              // aria-hidden="true"
            />
            <label htmlFor="alcoholic">Alcoholic</label>

            <input onChange={this.handleChange}
              type="radio"
              id="Non alcoholic"
              name="filteredDrinkName"
              value="Non alcoholic"
              // aria-hidden="true"
            />
            <label htmlFor="Non alcoholic">Non-Alcoholic</label>
          </div>
      </form>
    );
  }
}

export default Dropdown;
