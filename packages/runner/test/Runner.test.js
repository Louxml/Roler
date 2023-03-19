

import { Runner } from "../src/index.js";

const r = new Runner("init")

const a = {
    init: (...args) => {
        console.log(args)
    }
}

const b = {
    init: (...args) => {
        r.remove(a);
        console.log(22)
    }
}
const c = {
    init: (...args) => {
        console.log(111)
        console.log(r.items)
    }
}
r.add(b);
r.add(a);

r.add(c);



r.run(1, 2, 3, 4, 5, 6, 7, 8, 9, 0);