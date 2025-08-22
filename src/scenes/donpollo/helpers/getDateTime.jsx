
export const getDateTime=()=>{
    let today = new Date();
    let date = today.toISOString().slice(0,10);
    let time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    let dateTime = date + ' ' + time;
    
    return dateTime;
}

export default  getDateTime;  