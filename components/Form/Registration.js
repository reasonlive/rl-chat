import React from 'react';
import './index.css';

import Input from '../Input';
import Button from '../Button';
import Select from '../Select';

// countries module has country names and capitals,
//names in eng and rus
import countries from '../../countries/index.mjs';

const data = JSON.parse(countries);

const countryNames = []; //it's that puts into Select

for(let i=0;i<data.length;i++){
  countryNames.push(data[i].country.en);
}


const Form = ({title,action})=> {


	const handleClick = async (e)=>{
		e.preventDefault();
		let form = document.forms[0],send = true;

		for(let elem of form.elements){
			if(/[<>\/]+/.test(elem.value)){
				
				alert('You have typed incorrect value!');
				elem.focus();
				send = false;
				break;
				
			}else if(!elem.value && elem.tagName !== 'BUTTON'){
				alert(elem.name+" is empty!Please, fill it");
				elem.focus();
				send = false;
				break;
				
			}else if(elem.name === 'email'){
				if(!elem.value.match(/^([a-zA-Z0-9\-_]{1,30})@([a-z]{1,15}\.[a-z]{1,5})$/)){
					
					alert("You have typed incorrect email!");
					form.elements.email.focus();
					send = false;
					break;
					
				}
			}

			
		}

		if(send){
			let senddata = {
				name: form.elements.name.value,
				email:form.elements.email.value,
				password:form.elements.password.value,
				age:form.elements.age.value,
				country:form.elements.country.value
			};
			await sendData("/registration?act=r", senddata);
		}
		

		
	}


	const sendData = async (url, senddata) => {

		let response = await fetch(url, {method: 'POST', headers:{
			"Content-type": 'application/json;charset=utf-8'
		},
		body:JSON.stringify(senddata)

		});
		let data = await response.json();
		if(data.success){
			alert('You have registered! Now You may login to the website!');
			document.location.href = "/login";
		}else if(data.error){
			if(data.error.match('Name')){
				alert('That name is already used.Please,change the name');
				document.forms[0].elements.name.focus();
				//document.location.reload();
			}
			if(data.error.match('Email')){
				alert('That email is already used.Please,change the email');
				//document.location.reload();
				document.forms[0].elements.email.focus();
			}
		}else{
			alert('Registration Error! Please retry once again!');
			document.location.reload();
		}

	}

	return (
		<form className='form form-junior'>
			<p>{title}</p>
			<Input 
			type={'text'}
			name={'name'}
			placeholder={'username'}


			/>
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
			<Input 
			type={'number'}
			name={'age'}
			placeholder={'age'}
			/>
			<Select 
			id={'country'}
			name={'country'}
			options={countryNames}
			/>
			<Button 
			action={handleClick}
			text={'sign up!'}

			/>
		</form>
	)

}

export default Form;
