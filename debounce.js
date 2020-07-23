// delay before send search request
export function debounce(fn,duration){
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(()=>fn.apply(this,args),duration)
    }
}