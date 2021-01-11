import React , {useState,useEffect} from 'react';
import "./index.css";

const Tip = ({title,text,left,top,display})=>{

	let cssPosition = {

		display: display,
		position: 'absolute',
		left: left,
		top: top,
	},

	coords = {
			left: '',
			top: '',
			borderLeft: '',
			borderRight: '',
			borderTop: '',
			borderBottom: '',
			//display: ''
	};

	const widthOfTip = 200;

	/*const getMeasures = function(e){
		const tip = e.target.closest('.tip');
		state.width = getComputedStyle(tip).width;
		state.height = getComputedStyle(tip).height;
		state.width = parseInt(state.width);
		state.height = parseInt(state.height);
		
	}*/

	//this function needs to be done
	const computeArrowPos = function(x,y){
		//if(y < 200 )return 'top';
		if(x < widthOfTip || x < widthOfTip*2)return 'left';
		if(x > widthOfTip+20 || x > widthOfTip*2)return 'right';
	}



	const [arrowPos, changePos] = useState();


	const change = ()=>{

		
		let {left,top} = cssPosition;
		let whereToSetArrow = computeArrowPos(left,top);
		//console.log(whereToSetArrow)
		//let whereToSetArrow = 'left';
		if(whereToSetArrow === 'left'){
			coords.left = '-10%';
			coords.top = '30%';
			coords.borderLeft = '';
			coords.borderRight = '10px solid sienna';
		}
		if(whereToSetArrow === 'right'){
			coords.left = '100%';
			coords.top = '30%';
			coords.borderLeft = '10px solid sienna';
			coords.borderRight = '';
		}
		if(whereToSetArrow === 'top'){
			coords.left = '45%';
			coords.top = '-40%';
			coords.borderLeft = '';
			coords.borderRight = '';
			coords.borderBottom = '10px solid sienna';
		}
		if(whereToSetArrow === 'bottom'){
			coords.left = '45%';
			coords.top = '100%';
			coords.borderLeft = '';
			coords.borderRight = '';
			coords.borderBottom = '';
			coords.borderTop = '10px solid sienna';

		}
		
		changePos(coords)
		
	}

	useEffect(()=>{
		if(!left && !top)return;
		else change();
		//change()
	})




	const showPos = (e)=>{
		console.log(e.target.getBoundingClientRect())
	}



	return (

		<div style={cssPosition} onClick={showPos}>
			<div className='tip tip-junior'>
				
					<p>{title}</p>
				
				
					<p>{text}</p>
				
				<span style={arrowPos} 
				class='tip-arrow'>
				</span>
			</div>
		</div>
		
	)
}

export default Tip;