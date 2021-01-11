import React ,{
	useState,
	useEffect,
	useLayoutEffect,
	useRef,
	useReducer,
	useMemo} from 'react';

import './index.css';

import Main from '../../parts/Main';

import Footer from '../../parts/Footer';

import List from '../../components/List';
import Item from '../../components/Item';

import ItemMixed from '../../components/Item/ItemMixed';

import Message from '../../components/Message';
import Button from '../../components/Button';

const avaPath = process.env.PUBLIC_URL+'/img/avatars/';

let cssMsgTime = {
	color: 'black',
	fontSize:12
	

}

let cssUserAvatar = {
	width:40,
	height:40,
	borderRadius:50,
	
}



//msgs array that renders messages in a chat block
let msgs = [],currentUser;

const Chat = () => {


	//sets socket connection
	let [socket,setSocket] = useState();
	//renders chat data
	let [chat,getChat] = useState({});
	//renders user bar data
	let [users,getUsers] = useState([]);

	

	
	function getMsgs(data){
		if(Array.isArray(data)){
			msgs = data;
		}else{
			msgs.push(data);
		}
		return msgs;
		
	}

	//renders all messages in the chat
	let memoiseMsgs = useMemo(()=> getMsgs(msgs),[msgs])

	
	//scrolls message page down when it below textarea element
	let pageScroll = useRef(null);
	function movePageDown(){
			let val = pageScroll.current.scrollHeight;
			pageScroll.current.scrollTop = val;
	}



	const getChatInfo = async ()=>{

		if(!localStorage.getItem('logged'))return;
		
		let id = getChatId();
		

		try{
			//await new Promise(res=> setTimeout(res,1000));
			let response = await fetch('/chat/getData?id='+id);
			let result = await response.json();
			////result is {messages,chat,people,currentUser}
			currentUser = result.currentUser;

			let chatInfo = mutateChatData(result);
			getChat(chatInfo);
			getMsgs(result.messages);
			

			getUsers(result.people);
			//console.log(result.messages);
		}catch(e){
			console.log(e)
		}
		
	}

	const establishConnection = () => {
		if(!localStorage.getItem('logged')){
			document.location.href = '/';
			return;
		}
		const socket = new WebSocket(`ws://localhost:3000/ws`);
		setSocket(socket);


	}

	const listenSocketAndReact = ()=>{
		if(!socket)return;
		socket.onopen = function(){
			//socket.send()
		}
		socket.onmessage = function(msg){
			let data = JSON.parse(msg.data);
			getMsgs(data);
			movePageDown()
		}

		socket.onerror = function(e){
			console.log('There was an error: '+e.name+': '+e.message)
		}
		socket.onclose = function(e){
			console.log('socket is closed');
			establishConnection()
		}
	}

	

	useEffect(async ()=>{

	await getChatInfo();
	establishConnection();
	movePageDown()
			
	},[]);

	useLayoutEffect(()=>{
		listenSocketAndReact();
		movePageDown();
	})



	
	const deleteThisChatFromUserList = async ()=> {
		let chatId = getChatId();
		let resp = await fetch('/chat/deleteFrom', {
			method:'DELETE',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify({chat: chatId})
		})
		let result = await resp.text();
		if(result === 'success')document.location.href = '/main';
	}

	const openRightButtonMenu = ()=> {

	}

	//edit messages written by logged authenticated user
	const editMessage = async (e) => {
		let getback = false;
		let target = e.target.closest('.chat-msg-self');
		let message = target.children[0];

		let editField = 
		`<input 
		style="border-radius:15px;max-width:300px;word-wrap:break-word;
		margin: 20px 5px 10px 20px;font: 18px Lucida Console,Monospace;
		background-color:orange;padding:10px;text-align:center;outline:none;" 
		type="text" value='${message.innerHTML}'/>`;
		target.children[0].outerHTML = editField;
		target.children[0].focus();

		//bug in the DOM API so if we use the blur event
		// we have to delete one before another event action
		function blurHandler(){
			target.children[0].outerHTML = message.outerHTML;
		}

		target.children[0].addEventListener('blur', blurHandler);

		
		target.children[0].onkeydown = async function(e){
			if(e.code === 'Enter'){
				
				this.removeEventListener('blur', blurHandler)
				
				let val = e.target.value;

				target.children[0].outerHTML = message.outerHTML;
				


				

				let data = {
					chat: getChatId(),
					msg: target.dataset.id,
					body: val
				}
		
				/*let chatId = getChatId();
				let msgId = target.dataset.id;*/
				
				let resp = await fetch('/chat/editMessage',{
					method: 'POST',
					headers:{
						'Content-Type': 'application/json;charset=utf-8'
					},
					body: JSON.stringify(data)
				});
				let result = await resp.text();
				if(result === 'success')target.children[0].innerHTML = val;
				else console.log('fail');
			}
		}
		

	}


	//delete messages written by logged authenticated user 
	const deleteMessage = async (e)=> {

		let target = e.target.closest('.chat-msg-self');
		

		let chatId = getChatId();
		let msgId = target.dataset.id;
		
		let resp = await fetch('/chat/deleteMessage',{
			method: 'POST',
			headers:{
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify({chat:chatId,msg:msgId})
		});
		let result = await resp.text();
		if(result === 'success')target.remove();
	}



	const setEstimate = () => {

	}

	const setStatus = () => {

	}

	const addUser = () => {

	}

 


//rendering messages on the page
memoiseMsgs= memoiseMsgs.map((elem,idx)=>{
	if(elem.creator === currentUser){
		return (
			<div key={idx} data-id={elem.id} className='chat-msg-self'>
				<div className='msg'>{elem.body}</div>
				<div className='chat-msg-btns'>
					<span
					onClick={editMessage}
					 id='chat-msg-edit'>&#9998;</span>
					
					<span
					onClick={deleteMessage}
					 id='chat-msg-delete'>&#10006;</span>
					
				</div>
				<div className='chat-avatar'>
					<img src={avaPath+elem.avatar} alt={elem.creator} style={cssUserAvatar}/>
					<div>
						<span>{elem.creator}</span>
						<div style={cssMsgTime}>at:{elem.time}</div>
					</div>
		
				</div>
			</div>
		)
	}else{
		return (
	
	<div key={idx} className='chat-msg'>
		<div className='chat-avatar'>
		<img src={avaPath+elem.avatar} alt={elem.creator} style={cssUserAvatar}/>
		<div>
			<span>{elem.creator}</span>
			<div style={cssMsgTime}>at:{elem.time}</div>
		</div>
		
		</div>
		
		<div className='msg'>{elem.body}</div>
		
	</div>)
	}
})






 

//rendering list of users on the page
users = users.map((elem,idx)=> (
	<div key={idx} className='user-info-block'>

		<div>
			<span className={(elem.online)? 'user-dot-online' : 'user-dot'}>
			&#8226;</span>
			<img src={avaPath+elem.avatar} alt={elem.name} />
		<span>{elem.name}</span>
		</div>
		
		
		
		<span>status: {elem.status}</span>
		<span>estimate: {elem.estimate}</span>
		<Button text={'add user'}/>
</div>))


					      			
					      			
					      			
					      			
					      			
					      		

	


//vars for chat description at the right top angle
const {
	name,
	created,
	creator,
	messages,
	people,
	isPrivate,
	onliners
} = chat;





	return (

		<div className='body'>
			
			<Main 
			
		    content={
		        <div className='user-content'>

			      	<div className="chat-wrapper">
				      	<div className='chat'>
				      		<div
				      		ref={pageScroll}
				      		 className='chat-msgs'>{memoiseMsgs}</div>
				      		
					      	<Message name={'message'} id={'message'}
					      	rows={10}
					      	socket={socket}
					      	/>
				      	</div>
				      	<div className='chat-info-wrapper'>

				      		<div className='chat-info'>
					      	<div>name: {name}</div>
					      	<div>created date: {created}</div>
					      	<div>who created: {creator}</div>
					      	<div>messages amount: {messages}</div>
					      	<div>people amount: {people}</div>
					      	<div>people online: {onliners}</div>
					      	<div>{(isPrivate) ? 'private' : ''}</div>
					      	</div>
					      	<div className='chat-info-users'>
					      		{users}
					      	</div>
					      	<div className='chat-info-btns'>
					      	<button onClick={()=>document.location.href = '/main'}>
					      	back to page of chat lists</button>
					      	
					      	<button onClick={deleteThisChatFromUserList}>
					      	delete chat from my chat list</button>
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

export default Chat;


////helper for mutation of received chat's data that prepares data for rendering
function mutateChatData(data){
		let mutated = {};
		for(let key in data.chat){
			if(key === 'date'){
				mutated['created'] = data.chat[key].slice(0,data.chat[key].indexOf('T'));
			}else
			if(key === 'messages'){
				mutated[key] = data.chat[key].length;
			}else
			if(key === 'people'){
				mutated[key] = data.chat[key].length;
			}else{
				mutated[key] = data.chat[key];
			}

		}

		let onliners = 0;
		for(let user of data.people){
			if(user.online)onliners++;
		}
		mutated.onliners = onliners;

		return mutated;
}



function getChatId(){
		let path = document.location.href;
		let id = path.slice(path.lastIndexOf('/')+1,path.length);
		if(id.match(/[0-9abcdef]{24}/))return id;
		else return null;
}



