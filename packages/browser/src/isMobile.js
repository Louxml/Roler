

function checkPlatform(){

    const result = {
        apple: {
            phone: false,
            ipad: false,
            device: false
        },
        android: {
            phone: false,
            device: false
        },
        windows: {
            phone: false,
            device: false,
        },
        other: {
            device: false
        },
        phone: false,
        any: false
    }

    let sUserAgent = navigator.userAgent.toLowerCase();

    result.apple.phone = sUserAgent.match(/iphone os/i) == "iphone";
    result.apple.ipad = sUserAgent.match(/ipad/i) == "ipad";
    result.apple.device = result.apple.phone || result.apple.ipad;

    result.android.phone = sUserAgent.match(/android/i) == "android";
    result.android.device = result.android.phone;

    result.windows.phone = sUserAgent.match(/windows mobil/i) == "windows mobil";
    result.windows.device = sUserAgent.match(/windows/i) == "windows";

    result.other.device = !(result.apple.device || result.android.device || result.windows.device);
    
    result.phone = result.apple.phone || result.android.phone || result.windows.phone;
    result.any = true;

    return result;
}

export const isMobile = checkPlatform();