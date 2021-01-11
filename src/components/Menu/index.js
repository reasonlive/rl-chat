import React from 'react';
import Button from '../Button';
import "./index.css";

const Menu = ({css,buttons}) => {

let handleClick = (e)=>{
	if(e.target.innerHTML === 'registration'){
		document.location.href = '/registration';
	}
	if(e.target.innerHTML === 'login'){
		document.location.href = '/login';
	}
	if(e.target.innerHTML === 'chats'){
		document.location.href = '/chats';
	}
	if(e.target.innerHTML === 'groups'){
		document.location.href = '/groups';
	}
	if(e.target.innerHTML === 'people'){
		document.location.href = '/people';
	}

}


const btns = buttons.
map(elem=>( <Button text={elem} action={handleClick}/>) );

	return (
	   <div style={css} className='menu menu-junior'>
	   		{btns}
	   </div>
	)


}

export default Menu;