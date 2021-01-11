import React, {useState,useEffect} from 'react';
import './index.css';
import Button from '../Button';
import Menu from '../Menu';
import Switcher from '../Switcher';


const User = (props)=>{

	const logout = async ()=>{
		if(localStorage.getItem('logged')){
			let resp = await fetch('/logout/byajax');
			let result = await resp.text();
			if(result === 'success'){
				document.getElementsByClassName('user-bar-wrapper')[0].style.display = 'none';
				localStorage.removeItem('logged');
				document.location.href = '/';
			}
		}
		
	}

	const [appear, handle] = useState(false);

	let cssHeight = {};
	if(appear){
		cssHeight = {
			height:150
		}
	}else{
		cssHeight = {
			height:0
		}
	}

	const switchProfile = ()=>{
		if(appear)handle(false);
		else handle(true);
	}

	const cssSwitchBtn = {
		position:'absolute',
		right:'1px',
		top:'-35px',
	}
	

	const {
		name,
		avatar,
		registration,
		status,
		estimate,
		tags,
		chats,
		groups,
		country,
		age,
		email

	} = props;

	//css for Switcher component
	let cssSwitcher = {
		color: 'orange',
		backgroundColor: 'black',
		width: 300,
	}

	


	return (
		<div className='user-bar-wrapper'>
		<div style={cssHeight} className='user-bar user-bar-junior'>
			<div className='avatar'>
				<img src={process.env.PUBLIC_URL+"/img/avatars/"+avatar} alt={name} />
			</div>
			<div className='user-info'>
				<div>
					<p>username: </p>
					<p>registered: </p>
					<p>status: </p>
					<p>estimate: </p>
					<p>country: </p>
					<p>age: </p>
					<p>email: </p>
				</div>
				<div>
					<p>{name}</p>
					<p>{registration}</p>
					<p>{status}</p>
					<p>{estimate}</p>
					<p>{country}</p>
					<p>{age}</p>
					<p>{email}</p>
				</div>
				

			</div>
			<div className='user-stuff'>
				<div className='user-stuff__item'>
				<div>{(tags) ? tags.length : '0'} tags:</div>
				  <Switcher 
				  css={cssSwitcher} 
				  items={(tags && tags.length > 0) ? tags : ['empty']}
				  />
				</div>
				<div className='user-stuff__item'>
				<div>{(chats) ? chats.length : '0'} chats: </div>
				 <Switcher
				 	css={cssSwitcher}
				  items={( chats && chats.length > 0) ? chats : ['empty']} 
				  />
				</div>
				<div className='user-stuff__item'>
				<div>{(groups) ? groups.length : '0'} groups:</div>
				 <Switcher
				 	css={cssSwitcher}
				  items={(groups && groups.length > 0) ? groups : ['empty']} 
				  />
				</div>
			</div>
			<div className='user-buttons'>
			
			<Button text={'main'} action={()=>{document.location.href = '/main'}}/>
			<Button text={'my profile'} action={()=> {document.location.href = '/profile'}}/>
			<Button text={'logout'} action={logout}/>
			</div>
			

		</div>
		<Button 
			tip={'userBarTip'}
			action={switchProfile}
			css={cssSwitchBtn}
		/>

		</div>
	)


}

export default User;