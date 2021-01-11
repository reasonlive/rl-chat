import React,{useState,useEffect} from 'react';
import Main from '../../parts/Main';
import Header from '../../parts/Header';
import Footer from '../../parts/Footer';

//import Description from './components/Description';
//import Tip from './components/Tip';

import Item from '../../components/Item';
import ItemMixed from '../../components/Item/ItemMixed';
import List from '../../components/List';
import Switcher from '../../components/Switcher';



/*let groups = [

];

groups = groups.map(el=> (<ItemMixed object={el}/>) );*/






const Groups = () => {


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


	let [groups, setGroups] = useState([]);
	

	const getGroups = async ()=> {
		let response = await fetch('/groups/getInfo');
		let obj = await response.json();
		let mappedVals = obj.groups.map(el=> (<ItemMixed object={el}/>) );
		setGroups(mappedVals);
	}

	useEffect(async ()=>{
		await getGroups();
	},[])


	return (

		<div className='body'>
			<Main 
			header={<Header start/>}
		    content={
		        <div className='content'>
		        <List 
		        items={groups}
		        css={css}
		        />
		        </div>
		    }
		    footer={<Footer />}
			/>
		</div>


	)
}

export default Groups;
