
import { mesesNumero} from '../../../data/makeDataCrud';


export const getMesAnoCierre=(perpar)=>{
    console.log(perpar);
    
    const apar=perpar.substring(0,4);
    const mpar=perpar.substring(4,7);

    const foundMes = mesesNumero.find((element) => String(element.numeromes)===mpar);
    console.log("foundMes",foundMes);
    //setValueAno(apar);
    //setValueMes(foundMes.mes);

    //setTitulo(foundMes.mes,apar);

    return {valueAnoR:apar, valueMesR:foundMes.mes};
  };

  export const getAaaaMmAnterior=(fecha)=> {  
    let date = new Date(fecha);
    /* Javascript recalculará la fecha si el mes es menor de 0 (enero) 
      o mayor de 11 (diciembre) */
    date.setMonth(date.getMonth() - 1);
    /* Obtenemos la fecha en formato YYYY-mm */
    const valuePA=date.toISOString().substring(0, 7).replace("-","");

    console.log(valuePA);
    //setValorPeriodoAnterior(valuePA);
    return valuePA;
  };
  
  export const getAaaaMmSiguiente=(fecha)=>{
    let now = new Date(fecha);
    now.setMonth(now.getMonth() + 1);
    
    return(now.toISOString().substring(0, 7).replace("-","")); 

  };

  export default  getMesAnoCierre;