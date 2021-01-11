import React from 'react';
import Main from '../../parts/Main';
import Header from '../../parts/Header';
import Footer from '../../parts/Footer';
import Login from '../../components/Form/Login';
//import Description from './components/Description';
//import Tip from './components/Tip';


const SignIn = () => {
	return (

		<div className='body'>
			<Main 
			header={<Header start/>}
		    content={
		        <div className='content'>
		        <Login title={'Login form'}/>
		        </div>
		    }
		    footer={<Footer />}
			/>
		</div>


	)
}

export default SignIn;
