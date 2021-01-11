import React, {useState,useEffect} from 'react';
import './index.css';
import Button from '../Button';
import Menu from '../Menu';
import Item from '../Item';




const Switcher = ({items,css}) => {

	
	let [distance, changeDistance] = useState(0);

	

	let cssItem = {
		minWidth: 150,
		textAlign: 'center',
		display:'flex',
		justifyContent: 'center',
		cursor: 'pointer'
	}

	let margins = {
		marginLeft: distance
	}

	//the threshold of shifting elements
	const threshold = (items.length-1) * cssItem.minWidth;

	const switchElement = (e)=> {
		
		if(e.target.className === 'toLeft'){
			distance = distance - (cssItem.minWidth);
			if(distance <= (-threshold))distance = -threshold;
			changeDistance(distance)
			
		}
		if(e.target.className === 'toRight'){
			distance = distance + (cssItem.minWidth);
			if(distance >= 0)distance = 0;
			changeDistance(distance)
			
		}
	}

	

	const elems = items.map(elem=> {
		if(elem instanceof Object){
			return (<Item link text={elem.name} linkUrl={'/chat/'+elem.id} css={cssItem}/>)
		}else{
			
			return (<Item block text={elem} css={cssItem}/>)
		}
	});



	return (
		
		
		<div style={css} className='switcher'>
		<span onClick={switchElement} className='toLeft'>&#9668;</span>
			<div  className='items-wrapper'>
				<div className='items-frame'>
					<div style={margins} className='switcher-items'>
					{elems}
					</div>
				</div>
				
			</div>
			<span onClick={switchElement} className='toRight'>&#9658;</span>
		</div>
	
	
	)

}

export default Switcher;