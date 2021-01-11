import React, {useState,useEffect} from 'react';
import Main from '../../parts/Main';
import Header from '../../parts/Header';
import Footer from '../../parts/Footer';

//import Description from './components/Description';
//import Tip from './components/Tip';

import Item from '../../components/Item';
import ItemMixed from '../../components/Item/ItemMixed';
import List from '../../components/List';
import Switcher from '../../components/Switcher';








const Chats = () => {


	let [chats, setChats] = useState([]);
	

	const getChats = async ()=> {
		let response = await fetch('/chats/getInfo');
		let obj = await response.json();
		let mappedVals = obj.chats.map(el=> (<ItemMixed object={el}/>) );
		setChats(mappedVals);
	}

	useEffect(async ()=>{
		await getChats();
	},[])


	let css = {
		width:1000,
		display:'flex',
		flexDirection:'column',
		alignItems: 'center',
		height:300,
		borderRadius: 5,
		border: '1px solid firebrick',
		padding: '10px 0 10px 0',
		overflow: 'auto',
		backgroundColor: 'silver',
		boxShadow: '1px 5px 10px rgba(0,0,0,1)'

	}


	return (

		<div className='body'>
			<Main 
			header={<Header start/>}
		    content={
		        <div className='content'>
		        <List 
		        items={chats}
		        css={css}
		        />
		        </div>
		    }
		    footer={<Footer />}
			/>
		</div>


	)
}

export default Chats;

