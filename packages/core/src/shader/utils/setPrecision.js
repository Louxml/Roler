
import { PRECISION } from "../../../../constants/src/index.js";

export function setPrecision(src, requestPrecision, maxSupportPrecision){

    if (src.substring(src, 0, 9) !== "precision"){
        let precision = requestPrecision;
        if (requestPrecision === PRECISION.HIGH && maxSupportPrecision !== PRECISION.HIGH){
            precision = PRECISION.MEDIUM;
        }

        return `precision ${precision} float;\n${src}`;
    }else if(maxSupportPrecision !== PRECISION.HIGH && src.substring(0, 15) === `precision ${PRECISION.HIGH}`){
        
        return src.replace(`precision ${PRECISION.HIGH}`, `precision ${PRECISION.MEDIUM}`)
    }
    return src;
}