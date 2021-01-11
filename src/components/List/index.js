import React from 'react';
import Item from '../Item';
import './index.css'

//if Item is an image, @items must be an array of urls
//if item is a link, @items must be an array of {text,url} objects


const List = ({items,css,itemCss,tag,classAttr}) => {

	let listContent,result;
	
	if(tag === 'image'){
		result = items.map(elem=><Item classAttr={classAttr} css={itemCss} image imageUrl={elem}/>);
		listContent = (<div >{result}</div>)
	}
	if(tag === 'a'){
		result = items.map(elem=><Item classAttr={classAttr} css={itemCss} link text={elem.text} linkUrl={elem.url}/>);
		listContent = (<div >{result}</div>)
	}
	if(tag === 'div'){
		result = items.map(elem=><Item classAttr={classAttr} css={itemCss} block text={elem} />);
		listContent = (<div >{result}</div>)
	}
	if(tag === 'li'){

		result = items.map(elem=><Item classAttr={classAttr} css={itemCss} listItem text={elem} />);

		listContent = (
			<ul style={css}>
				{result}
			</ul>
		)

	}

	if(!tag){
		listContent = items;
	}





	return (
		<div style={css}>

		{listContent}

		</div>
	)


}

export default List;