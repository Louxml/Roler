
import { EventEmitter } from '../../src/eventemitter/EventEmtter.js';


function test1(){
    // 创建一个事件发射器
    const eventEmitter = new EventEmitter();

    // 监听事件
    eventEmitter.on('event', (data) => {
        console.log('收到事件:', data, this);
    });


    eventEmitter.once('start', function(d){
        console.log('start', d, this);
    }.bind(globalThis));

    // 触发事件
    eventEmitter.emit('event', 'Hello World');
    eventEmitter.emit('start', 'Hello World');
    eventEmitter.emit('start', 'Hello World');

}

// test1()