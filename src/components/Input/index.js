import React from 'react';
import './index.css';

const Input = (props) => {

	const text = React.createRef();

	const {
		type,
		placeholder,
		action,
		name,
		id,

	} = props;

	return (

		<div >
			<input
				className='input input-junior'
				type={type}
				placeholder={placeholder}
				onChange={action}
				name={name}
				id={id}
				ref={text}
			/>
		</div>

	)
}

export default Input;