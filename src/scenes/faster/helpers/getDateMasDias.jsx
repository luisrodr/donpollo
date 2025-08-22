


export const getDateMasDias=(finicio,dias)=>{

  let fecha = new Date(finicio);

  fecha.setDate(fecha.getDate() + dias);
  console.info("fecha :",fecha.toISOString());

  return fecha.toISOString().substring(0,10);
};

 

  

  export default  getDateMasDias;