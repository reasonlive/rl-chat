import React from 'react';
import './index.css';

const Item = (props) => {

	let {
		classAttr,
		span,
		block,
		link,
		listItem,
		image,
		linkUrl,
		imageUrl,
		text,
		css,

	} = props;

	if(span){

		return (
			<span className={classAttr} style={css}>
				{text}
			</span>
		)
	}

	if(block){

		return (
			<div className={classAttr} style={css}>
				{text}
			</div>
		)
	}

	if(link){
		return (
			<a className={classAttr} style={css} href={linkUrl}>
				{text}
			</a>
		)
	}

	if(listItem){
		return (
			<li className={classAttr} style={css} key={text}>
				{text}
			</li>
		)
	}

	if(image){
		return (
			<img className={classAttr} style={css} src={imageUrl} alt={text} />
		)
	}
}

export default Item;