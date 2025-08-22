

 const  esUnico=(tableData, searchElement,filtro) =>{
    for (let elements of tableData) {
     
        if (elements.codigo === searchElement) {
          if (elements.id !== filtro) {
               //console.log("ya existe el CODIGO ",elements.codigo);
                return true;
           }
      }  
    }
    return false;
  };


  export default  esUnico;