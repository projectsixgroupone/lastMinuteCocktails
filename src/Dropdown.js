import React, { Component } from "react";

class Dropdown extends Component {
constructor(){
    super();
    this.state={
        choice: ''
    }
}

handleChange = (e) => {
    this.setState({
        choice: e.target.value
    })
    this.props.getFilteredDrinks(e.target.value)
}

  render() {
    return (
    
        <form className="searchCategories">
          <div className="categoriesContainer wrapper">
                <p><i className="fas fa-filter"></i>Filter By:</p>
            <input onChange={this.handleChange}
              type="radio"
              id="all"
              name="filteredDrinkName"
              value="all"
            />
            <label htmlFor="all">All</label>

            <input onChange={this.handleChange}
              type="radio"
              id="alcoholic"
              name="filteredDrinkName"
              value="Alcoholic"
            />
            <label htmlFor="alcoholic">Alcoholic</label>

            <input onChange={this.handleChange}
              type="radio"
              id="Non alcoholic"
              name="filteredDrinkName"
              value="Non alcoholic"
            />
            <label htmlFor="Non alcoholic">Non-Alcoholic</label>
          </div>
      </form>
    );
  }
}

export default Dropdown;
