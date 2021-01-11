import React from 'react';
import Main from '../../parts/Main';
import Header from '../../parts/Header';
import Footer from '../../parts/Footer';
import Registration from '../../components/Form/Registration';
//import Description from './components/Description';
//import Tip from './components/Tip';

import Item from '../../components/Item';
import List from '../../components/List';
import Switcher from '../../components/Switcher';

const Feedback = () => {
	return (

		<div className='body'>
			<Main 
			header={<Header start/>}
		    content={
		        <div className='content'>
		        <Registration title={'Registration form'}/>
		        </div>
		    }
		    footer={<Footer />}
			/>
		</div>


	)
}

export default Feedback;

