import React from 'react';
import "./index.css";

const Description = ({title,sectionArray,image})=> {

	

	let sections = sectionArray.map(elem=> <section>{elem}</section>)


	

	return (
		<div  className='description description-junior'>
		<h2>{title}</h2>
		{sections}
		</div>
	)
}

export default Description;