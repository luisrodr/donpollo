 import dayjs from 'dayjs';
  
  const getPeriodo=(fecha)=>{
    return       dayjs(fecha).format("YYYY-MM-DD").toString().replace("-","").substring(0,6);

  };


  export default  getPeriodo;  