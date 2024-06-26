

import { EventEmitter } from '../../src/eventemitter/EventEmtter.js';


function test1(){
    // 创建一个事件发射器
    const eventEmitter = new EventEmitter();

    // 监听事件
    eventEmitter.on('event', (data) => {
        console.log('收到事件:', data);
    });

    // 触发事件
    eventEmitter.emit('event', 'Hello World');
}

// test1()