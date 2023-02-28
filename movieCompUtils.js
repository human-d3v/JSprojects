const debounce = (func,delay) => {
    let timeoutId;
    return (...args) => { //first loop will bypasss
        if(timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null,args);
        }, delay);
    };
};
