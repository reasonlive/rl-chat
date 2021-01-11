import React from 'react';
import './index.css';
import Header from '../Header';

const Main = (props) => {

	const {
		header,
		content,
		footer,
		css
	} = props;

	
	return (
		<div style={css} className='main'>
			{header}
			{content}
			{footer}
		</div>
    )
}

export default Main;