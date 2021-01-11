import React from 'react';
import './index.css';
import logo from './logo.svg';
import Menu from '../../components/Menu';
import Button from '../../components/Button';
import Input from '../../components/Input';
import searchPng from '../../components/Input/sd.png';
import List from '../../components/List';

let greeting = `Hello there! This
 website for people who love talking,
 chatting, heckling and certainly who wanna discuss
 the most sharpest problems and not only!
 `;

 let css = {
 	display:'flex',
 	alignItems: 'center'
 }

 let sLogoCss = {
 	padding:0,
 	width:40,
 	height:40,
 	marginTop:0,
 	cursor: 'pointer',
 	backgroundColor:'black'

 }

 let searchCss = {
 	position: 'relative',
 	display: 'flex',
 	flexDirection: 'row'
 }





 

 

 //let userContent = ();

const Header = ({start}) => {




let items = ['chats', 'groups', 'people'];

let handleClick = (e)=> {
	if(e.target.tagName === 'IMG' || e.target.className === 'website')
		document.location.href = '/';

	if(e.target.tagName === 'LI' || e.target.className === 'header-li'){
		
		document.location.href = "/"+e.target.innerHTML;
	}
	if(e.target.id === 'search-btn'){
		document.location.href = "/search";
	}
}

 let startContent = (
	 	<>			
	 	<div style={css}>
	 				<img  onClick={handleClick} src={logo} alt="logo" />
					<span onClick={handleClick} className="website">rl0chat</span>
		</div>	
					<List 
					tag={'li'} 
					items={items} 
					classAttr={'header-li'}
					
					/>

					<div style={searchCss}>
						<input className='input-search' type='text' placeholder='search' name='search' />
						<img id='search-btn' style={sLogoCss} src={searchPng} alt="s-logo" />
					</div>

					
					<Menu 

					buttons={['login', 'registration']}
					/>
		</>
	 );


	let body = start ? startContent : '';
	
	return (
		<div className='header' onClick={handleClick}>
			{body}
		</div>
    )
}

export default Header;