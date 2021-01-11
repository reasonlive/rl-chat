import React ,{useState,useEffect,useRef} from 'react';
import './index.css';
import arrow from './back-arrow.png';

import Main from '../../parts/Main';
import Footer from '../../parts/Footer';

import Button from '../../components/Button';
import Input from '../../components/Input';
import ListProfile from '../../components/List/ListProfile';
import Field from '../../components/Field';

const avaPath = "/img/avatars/";

const Profile = ()=> {

	let cssAvatar = {
		width:150,
		height:150,
		margin:90,
		
	}
	let cssFile = {
		width:'100%',
		marginLeft:'20%',
	}

	let cssBtn = {
		height:50,
		width:200,
	}

	let cssBtnRed = {
		height:50,
		width:200,
		color:'red'
	}

	let tagBtn = {
		height:50
	}

let userdata = {		
					name:'',
					avatar:'',
					status:'',
					estimate:'',
					country:'',

					age:'',
					email:'',
					chats:[],
					groups:[],
					tags:[],
					registered:'',
					
				};





	//gets user data to render on page
	let [data,getData] = useState(userdata);

	

	let {name,avatar,status,estimate,country,age,email,
		chats,groups,registered,tags} = data;

	//set values to textarea	
	let tagss = useRef(null);
	function setTags(value){
		tagss.current.innerHTML = value;
	}

	

	const getProfile = async ()=> {
		let response = await fetch('/profile/getData');
		let d = await response.json();

		console.log(d)
		let tags = '';
		d.tags.forEach(elem=>{
			tags += elem+'\n';
		})
		
		setTags(tags);
		
		getData(d);
	}

	const createChat = async (e)=>{
		let input = e.target.parentNode.children[0];
		console.log(input.value)

		if(!input.value || input.value.length > 80)return;

		let resp = await fetch('/profile/addChat', {
			method: "POST",
			headers:{
				'Content-type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify({name:input.value})
		})
		let result = await resp.text();
		console.log(result)
		if(result === 'success'){
			alert('chat was created successfully');
			document.location.reload();
		}else{
			alert('Error: chat was not created');
		}
	}

	const deleteChat = async(e)=>{
		let select = e.target.parentNode.children[0];
		//need a check for right id value
		if(!select.value || select.value.length > 40)return;
		
		let resp = await fetch('/profile/delChats', {
			method:'DELETE',
			headers:{
				'Content-type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify({chat: select.value})
		});

		let result = await resp.text();
		if(result === 'success'){
			alert('chat was removed successfully');
			localStorage.setItem('logged', false);
			document.location.reload();
		}else{
			alert('Error: chat was not removed');
		}
	}

	
	const deleteProfile = async(e)=>{

		

			let resp = await fetch('/profile/delProfile', {
				method: 'DELETE'
			});
			let result = await resp.text();
			if(result === 'success'){
				localStorage.removeItem('logged');
				alert('Your profile deleted!Good Luck!');
				document.location.href = '/';
			}else{
				alert('Error!Profile was not deleted');
			}
		


	}

	const uploadAvatar = async(e)=>{
		let input = document.querySelector('input[name=avatar]');
		let data = new FormData();
		data.append('avatar',input.files[0]);

		let resp = await fetch('/profile/uploadAvatar', {
			method:'POST',
			body:data
		});
		let result = await resp.text();
		if(result === 'success'){
			alert('Photo was uploaded');
			document.location.reload();
		}else{
			alert(result)
		}
	}

	const addTags = async (e)=>{

		let string = e.target.parentNode.children[0].value;
		let pattern = /#[a-zA-Zа-яА-Я0-9\-\_@]{2,30}/gm;

		let hashtags = string.match(pattern);

		

			if(Array.isArray(hashtags) && hashtags.length > 0){
				hashtags = hashtags.join('');
	
				let resp = await fetch('/profile/addTags', {
				method: "POST",
				headers:{
					'Content-type': 'application/json;charset=utf-8'
				},
					body: JSON.stringify({tags:hashtags})
				})

				let result = await resp.text();
				if(result === 'success'){
					
					document.location.reload();
				}else{
					console.log(result)
					alert('Error: chat was not created');
				}
			}

		
	} 

	

	useEffect(async ()=>{
		await getProfile();
	},[])

	

	let anotherchats = [], anothergroups = [];

	chats = chats.map((elem,ind)=> {
		if(!elem)return;
		if(elem && !elem.owner){
			anotherchats.push(elem);
			
		}else{
			return (
				<option key={ind} value={elem.id}>{elem.name}</option>
			)
		}
	})

	

	groups = groups.map((elem,ind)=> {
		if(!elem)return;
		if(elem && !elem.owner){
			anothergroups.push(elem);
			
		}else{
			return (
			<option key={ind} value={elem.id}>{elem.name}</option>
			)
		}
		
	})

	
	
	



	return (
		<div className='body'>

			<Main 
			content={
				<div className='user-content'>
					<div className='profile'>
						

						<div className='profile-item-a'>
							<div className='profile-avatar'>
							<img src={avaPath+data.avatar} alt={name}
							/>
							<div>
							<p>upload your photo:</p>
							<input type="file" name='avatar'/>
							</div>
							<button onClick={uploadAvatar}>upload</button>
							
							</div>
							

							<div className='profile-extra-block'>
								<div className='profile-extra-btns'>
									<Button
									 text={'back to previous page'} 
									 css={cssBtn}
									 action={()=>{window.history.back()}}
									 />
									<Button 
									text={'delete my profile'}
									 css={cssBtnRed} 
									 action={deleteProfile}
									 />
								</div>
								<div className='profile-extra-tags'>
									<p>You can point up to 5 hashtags in purpose to describe yourself to others</p>
										<div style={{display:'flex',width:'100%'}}>
											<textarea
											placeholder="example:#mySuperTag"
											ref={tagss}
											 name="tags" id="tags" cols="30" rows="10">
											
											
												
											</textarea>
											
											
											<button onClick={addTags}>add</button>
										</div>
									
									
								</div>
								
							
							</div>
						</div>

						<div className='profile-item-b'>
							<ListProfile
							 chats={anotherchats}
							  groups={anothergroups}
							  name={name}
							  country={country}

							  />
						</div>


						<div className="profile-item-c">

							<div className='profile-chat-menu list'>
								
								<Field 
								title={'my created chats'}
								select={{name: 'my-chats'}}
								items={chats}
								/>
								
								<Field 
								title={'create new chat'}
								input={{name: 'create-chat',placeholder:'name of chat'}}
								button={{action:createChat,value:'create'}}
								/>
								
								
								
								<Field 
								title={'delete my chat'}
								select={{name: 'del-chat'}}
								items={chats}
								button={{action:deleteChat,value:'delete'}}
								/>

								
								
								
							</div>

							<div className='profile-chat-menu list'>
								
								<Field 
								title={'my created groups'}
								select={{name: 'my-groups'}}
								items={groups}
								/>
								
								<Field 
								title={'create new group'}
								input={{name: 'create-group',placeholder:'name of group'}}
								button={{action:createChat,value:'create'}}
								/>
								
								
								
								<Field 
								title={'delete my group'}
								select={{name: 'del-group'}}
								items={groups}
								button={{action:deleteChat,value:'delete'}}
								/>
								
								
							</div>
						</div>
						
					</div>

				</div>
			}
			footer={<Footer />}

			/>
			
		</div>
		
	)
}

export default Profile;

