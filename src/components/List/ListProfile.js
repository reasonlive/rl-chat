import React,{useState} from 'react';
import './index.css';
import Button from '../Button';
import Field from '../Field';

const ListProfile = (props)=> {

	
	let {chats,
		groups,
		name,
		country
	} = props;

	//checks old password and renders special text
	let [check,unsetCheck] = useState(true);

	
	

	//checks old password
	async function checkPass(e){

		let pass = e.target.parentNode.children[0].value;
		if(!pass || pass.length > 30){
			e.target.focus();
			return;
		}

		let resp = await fetch('/profile/checkPass',{
			method:'POST',
			headers:{
				'Content-type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify({password:pass})
		});
		let result = await resp.text();
		if(result === 'success'){
			console.log(e.target.parentNode)
			e.target.parentNode.children[0].value = '';
			unsetCheck(false);
			e.target.parentNode.children[0].focus();
			alert('Now put the new password');
			return true;

		}else{
			alert('You put wrong password!');
			e.target.parentNode.children[0].focus();
			return false;
		}
		return false;
	}


	//changes password 
	//handler for the change button
	async function changePassword(e){

		let newPass = e.target.parentNode.children[0].value;
		if(!newPass || newPass.length < 1){
			alert('Put down the password!');
			e.target.parentNode.children[0].focus();
			return;
		}
		if(newPass){
			let resp = await fetch('/profile/changePass',{
				method:'POST',
				headers:{
					'Content-type': 'application/json;charset=utf-8'
				},
				body: JSON.stringify({password:newPass})
			});
			let result = await resp.text();
			if(result === 'success'){
				alert('You have changed the password! Now you have to login with it!');

			}else{
				alert('Error! Your Password was not changed!Try again!');
				return;
			}
		}
	}

	//changes name or country
	async function changeInfo(e){
		let val = e.target.parentNode.children[0].value;
		let name = e.target.parentNode.children[0].name;
		val = val.trim();
		name = name === 'username' ? 'username' : 'country';
		if(val && val.length > 1){
			let resp = await fetch('/profile/changeInfo',{
				method:'POST',
				headers:{
					'Content-type': 'application/json;charset=utf-8'
				},
				body: JSON.stringify({[name]: val})
			});
			let result = await resp.text();
			if(result === 'success'){
				alert('You have changed the info!');
				document.location.reload()

			}else{
				console.log(result)
				alert('Error! Your Info was not changed!Try again!');
				return;
			}
		}
	}

	//deletes user from other chats and groups
	const deleteUserFrom = async (e)=> {
		let chat = e.target.parentNode.children[0].value;
		if(chat.match(/^[0-9abcdef]{24}$/)){
			let resp = await fetch('/profile/delFromChats',{
				method:'POST',
				headers:{
					'Content-type': 'application/json;charset=utf-8'
				},
				body: JSON.stringify({chatId:chat})
			});
			let result = await resp.text();
			if(result === 'success'){
				document.location.reload();
			}else{
				console.log(result)
				alert('Error: You have not been deleted! Try again!');
			}
		}
		
	}


	


	
	chats = chats.length > 0 ? chats.map(elem=> (<option value={elem.id}>{elem.name}</option>) ) : [];

	
	groups = groups.length > 0 ? groups.map(elem=> (<option value={elem.id}>{elem.name}</option>) ): [];

	

	let cssBtn = {
		height:50,
	}


	return (

		<div className='profile-chat-menu list'>

				<Field 
				title={'change name:'}
				input={{name:'username', placeholder:name,}}
				button={{action:changeInfo,value:'change'}}
				/>
			
				<Field 
				title={'change country:'}
				input={{name:'country', placeholder:country,}}
				button={{action:changeInfo,value:'change'}}
				/>
				
			
				<Field 
				title={'change password:'}
				input={{type: 'password',name:'password', placeholder:
				(check ? 'old password' : 'new password')
				}}
				button={{action:
					(check ? checkPass : changePassword),
					value: (check ? 'check' : 'change')
				}}
				/>

				<Field 
				title={'delete me from chats:'}
				select={{name:'chats'}}
				items={chats}
				button={{action:deleteUserFrom,value:'delete'}}
				/>
				
				<Field 
				title={'delete me from groups:'}
				select={{name:'groups'}}
				items={groups}
				button={{action:deleteUserFrom,value:'delete'}}
				/>
			

		</div>
	)
}


export default ListProfile;