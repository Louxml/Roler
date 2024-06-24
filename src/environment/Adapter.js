
import { BrowserAdapter } from "./browser/BrowserAdapter.js";

let currentAdapter = BrowserAdapter;

export const DOMAdapter = {
    get(){
        return currentAdapter;
    },
    
    set(adapter){
        currentAdapter = adapter;
        return currentAdapter;
    }
}