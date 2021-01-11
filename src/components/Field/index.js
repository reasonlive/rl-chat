import React from 'react';
import './index.css';

const Field = (props)=>{

	let {
		items,
		select,
		input,
		button,
		title
	} = props;

	if(select && !button){

		items = Array.isArray(items) ? items : items.map((elem,ind)=> (<option key={ind} value={elem.id}>{elem.name}</option>) )
		return (
			<div className='field'>
				<p >{title || select.title}</p>
				<select name={select.name} >
				{items}
				</select>
			</div>

		)
	}

	if(select && button){
		items = Array.isArray(items) ? items : items.map((elem,ind)=> (<option key={ind} value={elem.id}>{elem.name}</option>) )
		return (
			<div className='field'>
				<p >{title || select.title}</p>
				<div className='field-action'>
					<select name={select.name} >
					{items}
					</select>
					<button onClick={button.action}>{button.value}</button>
				</div>
			</div>

		)
	}

	if(input && !button){
		//items = items.map((elem,ind)=> (<option key={ind} value={elem.id}>{elem.name}</option>) )
		return (
			<div className='field'>
				<p >{title || input.title}</p>

				<input onInput={input.action ? input.action : null}
				 name={input.name} type={input.type ? input.type : 'text'}
				  placeholder={input.placeholder}/>
				  
			</div>

		)
	}

	if(input && button){
		
		return (
			<div className='field'>
				<p >{title || input.title}</p>
				<div className='field-action'>

				<input onInput={input.action ? input.action : null}
				 name={input.name} type={input.type ? input.type : 'text'}
				  placeholder={input.placeholder}/>

				<button onClick={button.action}>{button.value}</button>
				</div>
			</div>

		)
	}
	
}

export default Field;



				/*<div className='profile-chat-menu list'>
								
								<p >my created chats</p>
								<select name="my-chats" id="">
								{chats}
								</select>
								
								
									<p >create new chat</p>
									<div className='profile-manage-item'>
									<input name='create-chat' type="text" placeholder={'name of chat'}/>
									<button onClick={createChat}>create</button>
									</div>
								
								
								
								<p >delete my chat:</p>
								<div className='profile-manage-item'>
								<select name="delete-chat" id="">
								{chats}
								</select>
								<button onClick={deleteChat}>delete</button>
								</div>
								
								
				</div>
				<div className='profile-chat-menu list'>
								
								<p >my created groups</p>
								<select name="my-groups" id="">
								{groups}
								</select>
								
								
									<p >create new group</p>
									<div className='profile-manage-item'>
										<input name='create-group' type="text" placeholder={'name of group'}/>
										<button>create</button>
									</div>
								
								
								
								<p >delete my group:</p>
								<div className='profile-manage-item'>
									<select name="delete-group" id="">
									{groups}
									</select>
									<button>delete</button>
								</div>
								
								
				</div>*/
						