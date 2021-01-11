import React, {Component} from 'react';
import './index.css';

class Button extends Component{
	constructor(props){
		super(props);
		this.state =  {
			htmlSymbol: (<span>&#9660;</span>),
			direction: 'down'
		}
	}

	changeSymbol(){
		let direction = this.state.direction === 'up' ? 'down' : 'up';
		let html = direction === 'up'  ? (<span>&#9650;</span>) : (<span>&#9660;</span>);

		this.setState({htmlSymbol: html});
		this.setState({direction: direction});
	}

	/*changeText = () =>{
		let value = this.state.text === 'hello world' ? 'goodbuy' : 'hello world';
		this.setState({text: value});
	}*/

	
	


	render(){

		const {text,action,css,tip,destination} = this.props;

		const html = this.state.htmlSymbol;

		return (
			<button 
			style={css} 
			data-tip={tip}
			data-destination={destination}
			className='btn btn-junior'
			onClick={(e)=>{
				/*if(e.target.dataset.tip){
					e.target.removeAttribute('data-tip')
				};*/
			if(action)
			action(e);
			this.changeSymbol()
			}}>
				{(text) ? text : html}
			</button>

		)

	}
}

export default Button;