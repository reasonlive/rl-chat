import React,{useState} from 'react';
import './index.css';
import Button from '../Button';
import Item from '../Item';

const Message = ({name,id,rows,disabled,css,socket}) => {

	//let [sock,getSocket] = useState(socket);

	//helper for getting chat id to cast it via ajax request
	const getChatId = () => {
		let path = document.location.href;
		let id = path.slice(path.lastIndexOf('/')+1,path.length);
		if(id.match(/[0-9abcdef]{24}/))return id;
		else return null;
	}

	//handler for clear textarea
	const clearField = (e)=>{
		if(document.getElementsByTagName('textarea')[0].value)
			document.getElementsByTagName('textarea')[0].value = '';
	}

	//handler for sending messages in chats
	const sendMsg = async (e)=> {
		let msg = document.querySelector('textarea[name=message]');
		if(!msg.value)return;
		msg.value = msg.value.trim();
		if(msg.value.length < 1)return;

		let gen = genKey(24);
		//sends from socket to the client
		socket.send(msg.value+'/'+gen);

		//sends from ajax to the database
		let json = JSON.stringify({msg: msg.value, chat: getChatId(),gen: gen});
		msg.value = '';
		
		let resp = await fetch('/chat/postMessage', {
			method:"POST", 
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: json
		})
		if(resp.ok){
			let result = await resp.text();
			if(result !== 'success'){
				console.log('need to handle sendmessage error');
			}
		}else{
			console.log('request not accomplished')
		}
		
	}

	/*const handleKeyDown = (e)=>{
		try{
			if(e.code === 'Enter')sendMsg(e);
		}catch(e){
			console.log(e)
		}
		
	}*/

	
	return (
		<div className='message-wrapper'>
			
		
		<div className='message'>
			<textarea style={css} name={name} id={id} rows={rows}
			disabled={disabled}
			
			 ></textarea>
			 
			<div className='message-btns'>
				<Button text={'clear'} action={clearField}/>
				<Button text={'send'} action={sendMsg}/>
			</div>
			
		</div>
		</div>
	)
}

export default Message;


//generates extra message key
function genKey(length){
	let str = '0123456789abcdef';
	
	
	let gen = '';
	for(let i=0;i<length;i++){
		let randNum = Math.random()*(str.length-1);
		randNum = randNum.toFixed()
		
		gen += str.charAt(randNum);
	}
	return gen;
	
}