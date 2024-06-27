
import { Buffer } from '../../src/rendering/renderers/shared/buffer/Buffer.js';

function test1(){
    const arr = new Float32Array([0, 1, 2]);
    const buffer = new Buffer({
        data: arr
    });

    buffer.on('update', () => {
        console.log(buffer);
    })

    buffer.on('change', () => {
        console.log(buffer);
    })

    console.log(buffer);
    // buffer.data = [1,2,3,4];
    // buffer.data[1] = 10;
    buffer.update();
}

// test1()