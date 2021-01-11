import React, {useState,useEffect} from 'react';
import './index.css';

import Input from '../Input';
import Button from '../Button';
import Select from '../Select';



const Form = ({title,action})=> {

	let forText = {
		textAlign: 'center'
	}


	const handleClick = async (e)=>{
		e.preventDefault();
		let form = document.forms[0];
		if(/^([a-zA-Z0-9\-_]{1,30})@([a-z]{1,15}\.[a-z]{1,5})$/.
			test(form.elements.email.value)){

			let data = {
				email: form.elements.email.value,
				password:form.elements.password.value
			}
			await sendData("/login?act=l", data);
		}else{
			alert("You have typed incorrect email!");
			form.elements.email.focus();
		}
		
	}

	const handleRegistrationClick  = (e)=>{
		e.preventDefault();
		document.location.href = '/registration';
	}


	const sendData = async (url, sendData) => {
		

		let response = await fetch(url, {method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify(sendData)

		});
		let data = await response.json();
		if(data.success){
			localStorage.setItem('logged', true);
			document.location.href = "/main";
		}else if(data.error){
			alert(data.error);
			document.location.reload();
		}else{
			alert('Login Error! Please retry once again');
			document.location.reload();
			
		}
			

	}





	return (


		<form className='form form-junior'>
			<p>{title}</p>
			<p style={forText}>If you haven't registered yet,please do it now</p>
			<Input 
			type={'email'}
			name={'email'}
			placeholder={'email'}

			/>
			<Input 
			type={'password'}
			name={'password'}
			placeholder={'password'}
			/>
			<div className='row'>
				<Button 
				text={'sign in!'}
				action={handleClick}
				/>
				<Button 
				text={'registration'}
				action={handleRegistrationClick}
				/>
			</div>
			
		</form>
	)

}

export default Form;