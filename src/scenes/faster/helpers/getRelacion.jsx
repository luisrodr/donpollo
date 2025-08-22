const getRelacion=(tableData,laid)=>{
    return tableData.find(({ id }) => id === laid);
  };


  export default  getRelacion;  