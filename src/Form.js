import React, {Component} from 'react'


class Form extends Component {
    constructor(){
        super();
        this.state= {
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

            <form action="submit" onSubmit = {this.onSubmit}>
                <input type="text" onChange={this.onChange} />
                {this.props.error=== true ? <p>your search returned no results</p>: null}
                <button>Search</button>
         
            </form>
        );
    }
}

export default Form 