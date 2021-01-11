import React, {useState,useEffect} from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import './App.css';
import Tip from './components/Tip';
import User from './components/User';

import Home from './pages/Home';
import MainPage from './pages/Main';
import SignUp from './pages/Registration';
import SignIn from './pages/Login'; 
import Feedback from './pages/Feedback';
import Chats from './pages/Chats';
import Groups from './pages/Groups';
import People from './pages/People';
import Chat from './pages/Chat';
import Profile from './pages/Profile';


function getDate(dateString){
  return dateString.slice(0,dateString.indexOf('T'));
}




const App = () => {


const avaPath = process.env.PUBLIC_URL+'/img/avatars/';

//////FUNCTIONS FOR THE TIPS AND HANDLERS FOR it
let [tipOptions, setTipOptions] = useState({display:'none'});

const measureSides = (elem,delta)=> {
  //let {width,height,left,right} = getComputedStyle(elem);
  let {left,right,top,bottom} = elem.getBoundingClientRect();
  let {innerHeight,innerWidth} = window;

  if(delta === 'x'){
    if((left + 200) > innerWidth)return left-200;
    if((left-200) < 0)return left+200;
  }
  if(delta === 'y'){
    if((bottom+20) > innerHeight)return bottom-20;
    if((top-20) < 0)return top+20;
  }

  
}

let handleMouseMove = (e)=> {

  
  
  if(e.target.dataset.tip && e.target.dataset.tip === 'userBarTip'){
    let {pageX,pageY} = e;
    //let {innerHeight,innerWidth} = window;

    
    
    pageX = measureSides(e.target,'x');
    pageY = measureSides(e.target, 'y');

    /*if(parseInt(e.target.style.right) < 200)
      x = e.target.getBoundingClientRect().left - 200;
    if(parseInt(e.target.style.top) < 10)
      y = e.target.getBoundingClientRect().bottom - 10;*/

    tipOptions = {
      //title: 'Info tip',
      text: 'this button opens your personal information',
     
      left:pageX,
      top:pageY,
      display:'inline-block'
    };

    //setTipOptions(tipOptions);
  }

  if(!e.target.dataset.tip){
    setTipOptions({text:'',top:'',left:'',display:'none'});

  }
}

/*useEffect(()=>{

let countDown = setTimeout(()=>setTipOptions(tipOptions),2000);

return ()=>clearTimeout(countDown);
        
},[tipOptions]);*/

let {title,text,left,top,display} = tipOptions;


/////////////////////////////////////////////////////////////


/////////GET USER INFO IF IT AVAILABLE///////////
//let [visible, setVisible] = useState(false);
let [userInfo, getUserInfo] = useState({});
let [registration, getRegistration] = useState(); 
let {name,avatar,status,estimate,country,age,email,
tags,chats,groups} = userInfo; 


/*let data = {
    name: 'Viktor',
    age: 14,
    country: "Belgorod",
    email: 'nick@mail.ru',
    registration: '12.12.12',
    status: 'newbie',
    estimate: 0,
    tags: [],
    groups:[],
    chats:[],

    avatar: 'avatar.png',
    admin: false,
    ban: {
      banned:false,
    }

  }*/

/*let {name,avatar,status,estimate,country,age,email,
tags,chats,groups,registration} = data;*/


const preventDefault = ()=>{
  document.body.addEventListener('contextmenu',function(e){
    e.preventDefault();
    return false;
  })
  document.body.addEventListener('select', function(e){
    e.preventDefault();
    return false;
  })
}

const getUser = async ()=>{
  try{
    let response = await fetch('/_user');
    let result = await response.json();
    if(result.name){
      getUserInfo(result);
      getRegistration(getDate(result.registered));
      document.getElementsByClassName('user-bar-wrapper')[0].style.display = 'block';
    }else if(result.unlogged){
      localStorage.removeItem('logged');
    }
  }catch(e){
    console.log(e)
  }
  
}



useEffect(async ()=>{
  await getUser();
  preventDefault();
},[])


  return (

    
    <div onMouseMove={handleMouseMove}>

    <User 
        name={name}
        avatar={avatar}
        registration={registration}
        status={status}
          estimate={estimate}
          tags={tags}
          chats={chats}
          groups={groups}
          country={country}
          age={age}
          email={email}
      />
    
    <Router>



    <Switch>
      <Route exact path="/">
     <Home />
      </Route>

       

      <Route exact path="/main">
      <MainPage />
      </Route>


      <Route  path="/registration">
      <SignUp />
      </Route>

      <Route  path="/login">
      <SignIn />
      </Route>

      <Route  path="/feedback">
      <Feedback />
      </Route>

       <Route  path="/chats">
      <Chats />
      </Route>

      <Route  path="/chat">
      <Chat />
      </Route>

      <Route  path="/groups">
      <Groups />
      </Route>

      <Route  path="/people">
      <People />
      </Route>

       <Route  path="/profile">
      <Profile />
      </Route>
      
    </Switch>

    </Router>

    <Tip 
    title={title}
    text={text}
    left={left}
    top={top}
    display={display}

    />
    </div>
  )
  
}




export default App;
