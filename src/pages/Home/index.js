import React,{useEffect} from 'react';

import Header from '../../parts/Header';
import Footer from '../../parts/Footer';

import User from '../../components/User';
import Main from '../../parts/Main';
import Description from '../../components/Description';
import ItemMixed from '../../components/Item/ItemMixed';
import Item from '../../components/Item';
import List from '../../components/List';
import Tip from '../../components/Tip';

const Home = () => {

const checkLoggedOrNot = ()=>{
  if(localStorage.getItem('logged')){
    document.location.href = '/main';
  }
}

useEffect(()=>{
  checkLoggedOrNot()
},[]);


let html = (
            <Main header={<Header start/>}
          content={
            <div  className='content'>
            <Description 
            title={'Start to communicate with people'}
            sectionArray={[`There are several ways how to communicate.
             It could be private or public chats, personal or professional groups by interest`]}
            />

            <Description 
            title={'Find friends and people by interest'}
            sectionArray={[`Our platform helps to find people who has
             the same professional skills and hobbies like you have` ]}
            />
            </div>
          }
          footer={<Footer />}
          />
        );

  return (

    
    <div className='body'>
     
    {html}
    
    </div>


  )
}


export default Home;



