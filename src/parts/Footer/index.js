import React from 'react';
import "./index.css";
import Item from '../../components/Item';
import List from '../../components/List';

let items = [{text: 'feedback', url: '/feedback'},
 			{text: 'agreement', url: '/agreement'},
 			{text: 'rules', url: '/rules'}];




const Footer = ({css,cssList})=> {


	cssList = {
		
  		width:100,
  		display: 'flex',
  		flexDirection: 'column',

	}

	css = {
		display:'block',
		height:100,
		width:100,
	}


	return (
		<div className='footer'>
			<List 
			tag={'a'} 
			items={items}
			itemCss={cssList}
			
			/>
			<div>
				<span className='list'>&copy;2021</span>
			</div>
		</div>

	)
}

export default Footer;