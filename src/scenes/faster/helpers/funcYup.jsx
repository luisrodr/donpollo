export const  esUnicoYup=(tableData, searchElement,filtro) =>{
    if (filtro !== "new" ){
      for (let elements of tableData) {
      
          if (elements.codigo === searchElement) {
            if (elements.id !== filtro) {
                //console.log("ya existe el CODIGO ",elements.codigo);
                  return true;
            }
        }  
      }
    };
    return false;
};


export const existeCodigoYup=(code,valueIdyup,tableData)=>{
    if (valueIdyup.id === "new" ){
       return tableData.find(({ codigo }) => codigo === code);
     };
  };


  
export const onlyNumbers=(st)=>{
  const regex = /^[0-9]*$/;  
  return regex.test(st);
};