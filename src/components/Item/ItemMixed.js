import React from 'react';
import './index.css';
import Button from '../Button';

const avaPath = '/img/avatars/';

const ItemMixed = ({user,chat,group,object,css,id}) => {


	//handle buttons of chats and groups items in the tables
	const getIntoTheItem = async (e)=>{
		if(!localStorage.getItem('logged')){
			alert('You have to be logged for this action!');
			document.location.href = '/login';
			return;
		}
		if(e.target.dataset.destination === 'membership'){
			let targetEntity = e.target.closest('.item-mixed');
			if(targetEntity.dataset.destination === 'chat'){
				//let response = await fetch('/chats/enter?id='+id);
				document.location.href = '/chat/'+id;
			}
			if(targetEntity.dataset.destination === 'group'){
				document.location.href = '/group';
			}
		}
		if(e.target.dataset.destination === 'friendship'){
			let targetEntity = e.target.closest('.item-mixed');
			if(targetEntity.dataset.destination === 'user'){
				alert('Request to add user to your user list was made! Please, wait for confirmation from the user');
			}
		}
	}


	let map = new Map(),content = [];

	let descr = [], buttons = [],names = [],avatars = [],tagNames = [];

	

	let cssAvatar = {
		width:50,
		height:50,
		borderRadius: '50%'
	}

	

	
	


	
	if(object){
		for(let key in object){
			map.set(key,object[key]);
		}

		for(let pair of map){
			let [key,value] = pair;

			if(key === 'private' && !value){

				continue;
			}else if(key === 'private' && value){
				descr.push((<div className='descr'>{key}</div>));
				continue;
			}

			if(key === '_id'){
				continue;
			}

			if(key === 'avatar'){
				avatars.push((<img style={cssAvatar} src={(avaPath+value)} alt={key} />));
				continue;
			}

			if(key === 'name'){
				names.push((<div className='item-name'><span>{value}</span></div>));
				continue;
			}

			if(key === 'tags'){

				/*value.forEach(elem=> {
					tagNames.push((<div className='descr tag-cell'>{elem}</div>))
				})*/
				descr.push((<div className='descr tag-cell'>{key} : {value}</div>));
				continue;
			}
			

			descr.push((<div className='descr'>{key} : {value}</div>));
		}

		if(!user)buttons.push(<Button text={'get in'} destination={'membership'}/>)
		if(user)buttons.push(<Button text={'add'} destination={'friendship'}/>)
		
	}

	return (
		<div style={css} className='item-mixed' onClick={getIntoTheItem}
		data-destination={(user) ? 'user' : (group) ? 'group' : 'chat'}>
		{(avatars.length > 0) ? <div className='itemMixed-user-block'>{avatars}{names}</div> : <div >{names}</div>}
		
		<div className='descr-block'>{descr}
		</div>
		<div className='itemMixed-buttons'>
		{buttons}
		</div>
		 
		</div>
	)
	
}

export default ItemMixed;