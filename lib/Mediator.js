export default async function Mediator(data){

	this.events = {};
	this.publishers = {};
	this.subscribers = {};

	this.data = {
		...data
	}

	this.setEvent = function(event, handler){
		if(!event)return false;
		if(!this.events[event]){
			this.events[event] = [handler] || [];
		}
		if(!this.events[event].includes(handler))
			this.events[event].push(handler);
	}

	this.setHandler = function(event, handler){
		if(!event)return false;
		if(!this.events[event])return false;

		if(!this.events[event].includes(handler))
			this.events[event].push(handler);
	}

	this.setData = function(data){
		let available = this.data;
		this.data = {...available, ...data};
	}

	this.linkPublisher = function(name, event){
		if(!this.publishers[name]){
			this.publishers[name] = [event];
		}
		if(!this.publishers[name].includes(event)){
			this.publishers[name].push(event);
		}
	}

	this.linkSubscriber = function(name, event){
		if(!this.subscribers[name]){
			this.subscribers[name] = [event];
		}
		if(!this.subscribers[name].includes(event)){
			this.subscribers[name].push(event);
		}
	}

	this.emit = async function(publisher, subscribers){
		let events = this.publishers[publisher];
		
		if(!subscribers || subscribers === this.subscribers){
			 
			 for(let e of events){
			 	this.events[e].forEach(async handler=> await handler(this.data));
			 }
			 return this;
		}
		else{

			for(let sub of subscribers){
				for(let e of events){
					await sub.on(e);
				}
			}
		}
		return this;
	}


	
}

/*const med = new Mediator();

med.linkPublisher('hello', 'world');
med.linkPublisher('hello', 'world2');
med.linkPublisher('hello', 'world')

class sub {


	state = {
		name: 'sub',
	}
	data = {

	}

	constructor(data){
		this.data = data;
	}

	async sendData(data){
		await require('fs').promises.writeFile('some.json', JSON.stringify(data), 'utf8');
		console.log(this.state.name+' recieved data and saved it');
	}

	async on(event){
		if(event === 'world'){
			await this.sendData(this.data);
		}
		if(event === 'world2'){
			console.log('event world2 has not watched by this subscriber');
		}
	}
}


console.log(first == 5)*/

//med.setData({name: 'viktor', age: 44, country: 'Izrael'});

//console.log(med.data)
//med.emit('hello', [new sub(med.data)]);

//console.log(med.publishers)

//console.log(sub)