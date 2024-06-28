
import { EventEmitter } from '../../src/eventemitter/EventEmtter.js';


function test1(){
    // 创建一个事件发射器
    const eventEmitter = new EventEmitter();

    // 监听事件
    eventEmitter.once('event', (data) => {
        console.log('收到事件:', data, this);
    }, globalThis);


    eventEmitter.on('event', function(d){
        console.log('start', d, this);
    }, globalThis);

    eventEmitter.on('event', (data) => {
        console.log('收到事件1:', data, this);
    }, globalThis);

    // 触发事件
    eventEmitter.emit('event', 'Hello World');
    eventEmitter.emit('event', 'Hello World');
    // eventEmitter.emit('start', 'Hello World');

}

// test1()