const emitter = require('events').EventEmitter;
const signal = new emitter();

//Cache saves data and handles events on global level of entire application

class Cache {

	static values = new Map();
	static signal = signal;
	static events = [];

	static set(key,value){
		this.values.set(key,value);
	}

	static get(key){
		if(this.values.has(key))
			return this.values.get(key);
		else return null;
	}

	static delete(key){
		if(this.values.has(key))
			this.values.delete(key);
	}

	static clear(){
		this.values.clear();
	}


	static emitSignal = (eventName,...args)=>{
		this.signal.emit(eventName,...args);
	}

	static listenSignal = (eventName,listener)=>{
		this.signal.on(eventName, listener);
		this.events.push({[eventName]:listener});
	}

	static stopListenSignal = (eventName)=>{
		const listener = this.getEventListener(eventName);
		this.signal.off(eventName, listener);
	}

	static stopSignals(eventName){
		this.signal.removeAllListeners(eventName);
		this.events = [];
	}

	static getEventListener(event){
		for(let item of this.events)
			if(item[event])return item[event];
		return null;
	}

}



module.exports = Cache;

Cache.set('cur', 'hello');
Cache.set('cur', 'world');

console.log(Cache.get('cur'))