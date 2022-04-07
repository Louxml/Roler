class E{
    constructor(fn, context, once){
        this.fn = fn;
        this.context = context;
        this.once  = once || false;
    }
}

export class EventEmitter{
    constructor(){
        this._events = Object.create(null);
    }
}

EventEmitter.prototype.addListener = function addListener(event, fn, context, once){
    if (typeof fn !== "function")
        throw new TypeError("The listener must be a function");
    
    let listener = new E(fn, context || this, once);
    if (!this._events[event])this._events[event] = []
    this._events[event].push(listener);
    return this;
}

EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once){
    if (!this._events[event])return this;
    if (!fn){
        this.clearEvent(event);
        return this;
    }
    let listeners = this._events[event];
    this._events[event] = listeners.filter(e => {
        return e.fn !== fn || (once !== null && once !== e.once) || (context !== null && context !== e.conext);
    });
    if (!this._events[event].length)this.clearEvent(event);
    return this;
}

EventEmitter.prototype.removeAllListeners = function removeAllListeners(event){
    if (event){
        if (this._events[event])this.clearEvent(event);
    }else{
        this._events = Object.create(null);
    }
    return this;
}

EventEmitter.prototype.clearEvent = function clearEvent(event){
    delete this._events[event];
    return this;
}

EventEmitter.prototype.getEventNames = function getEventNames(){
    let names = [];
    let events, name;

    for (name in (events = this._events)){
        if (Object.prototype.hasOwnProperty.call(events, name))names.push(name);
    }

    if (Object.getOwnPropertySymbols){
        return names.concat(Object.getOwnPropertySymbols(events));
    }

    return names;
}

EventEmitter.prototype.getListeners = function getListeners(event){
    let handlers = this._events[event];
    return handlers.map((e) => e.fn);
}

EventEmitter.prototype.getListenerCount = function getLisStenerCount(event){
    let listeners = this._events[event];
    return listeners.length;
}

EventEmitter.prototype.emit = function emit(event, a1){
    let listeners = this._events[event];

    if (!listeners)return false;
    let len = arguments.length;

    listeners.forEach(e => {
        if (e.once)this.removeListener(event, e.fn, undefined, true);
        
        switch(len){
            case 1: e.fn.call(e.context);break;
            case 2: e.fn.call(e.context, a1);break;
            default:
                e.fn.apply(e.conext, arguments.splice(1));
                break;
        }
    });
    return true;

}

EventEmitter.prototype.on = EventEmitter.prototype.addListener;
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.once = function once(event, fn, context){
    return this.on(event, fn, context, true);
}