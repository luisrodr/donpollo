


export const getFechaInicioProceso=(valueProceso)=>{

  const apro=valueProceso.substring(0,4);
  const mpro=valueProceso.substring(4,7);

  
  return `${apro}-${mpro}-01`;
};

 

  

  export default  getFechaInicioProceso;