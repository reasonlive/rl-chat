import React,{useState,useEffect} from 'react';

import Header from '../../parts/Header';
import Footer from '../../parts/Footer';
import Main from '../../parts/Main';
import ItemMixed from '../../components/Item/ItemMixed';
import Item from '../../components/Item';
import List from '../../components/List';



const MainPage = () => {

//checks if user logged or not as we want prevent guests from this page
  const checkLoggedOrNot = ()=>{
    if(!localStorage.getItem('logged')){
      document.location.href = '/';
    }
  }



//rendering of the main tables
let [groups,setGroups] = useState([]);
let [chats,setChats] = useState([]);
let [users,setUsers] = useState([]);


//renders all the entities from the database
const getAllData = async ()=> {
  let data = await fetch('/main/getData');
  let parsedData = await data.json();

  setGroups(parsedData.groups);
  setChats(parsedData.chats);
  setUsers(parsedData.users);

}



useEffect(async ()=>{
  await getAllData();
},[])

useEffect(()=>{
  checkLoggedOrNot()
},[]);



groups = groups.length > 0 ? groups.map(el=> (<ItemMixed id={el._id} group object={el}/>) ) : <Item block text={'list is empty'}/>;
chats = chats.length > 0 ? chats.map(el=> (<ItemMixed  id={el._id} chat object={el}/>) ) : <Item block text={'list is empty'}/>;
users = users.length > 0 ? users.map(el=> (<ItemMixed  id={el._id} user object={el}/>) ) : <Item block text={'list is empty'}/>;

let css = {
    width:1200,
    display:'flex',
    flexDirection:'column',
    alignItems: 'center',
    height:300,
    borderRadius: 5,
    border: '1px solid firebrick',
    padding: '10px 0 10px 0',
    overflow: 'auto',
    backgroundColor: 'silver',
    boxShadow: '1px 5px 10px rgba(0,0,0,1)',
    margin: '10px 0 10px 0',
}


let listOfChats = (<List css={css} items={chats}/>);
let listOfGroups = (<List css={css} items={groups}/>);
let listOfUsers = (<List css={css} items={users}/>);



return (

        <div className='body'>


          <Main 

          content={
            <div  className='user-content'>
            <center><div className='content-title'>Tables of chats and groups which may be looked over and visited </div></center>

            <div className='content-block'>

            <div><p>List of chats<span>{(chats.length) ? (chats.length) : 0} items</span></p>
            {listOfChats}
            </div>

            <div><p>List of groups<span>{(groups.length) ? (groups.length) : 0} items</span></p>
            {listOfGroups}
            </div>

            <div><p>List of users<span>{(users.length) ? (users.length) : 0} users</span></p>
            {listOfUsers}
            </div>
            </div>
            
            </div>
          }
          footer={<Footer />}
          />


        </div>
)

}


export default MainPage;