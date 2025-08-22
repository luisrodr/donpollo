const getLineaKardex=(ide,doc,fec,art,ades,glo,per,emu,emv,smu,smv,pre,sun,sva)=>{

    const lineaKardex={
      id:ide,
      documento:doc,
      fecha:fec,
      articulo:art,
      descripcion:ades,
      glosa:glo,
      periodo:per,
      entradaMovimientoUnidad:emu,
      entradaMovimientoValor:emv,
      salidaMovimientoUnidad:smu,
      salidaMovimientoValor:smv,
      precioPromedio:pre,
      saldoUnidad:sun,
      saldoValor:sva,
  };
  return lineaKardex;
};

const runCierreReport0=(pAnterior,pCerrar,tableDataArticulo,valueCierre,valueMovimientosPeriodo)=>{
    console.log("runCierreReport0 inicio...> ");
    console.log("pAnterior",pAnterior); 
    console.log("pCerrar",pCerrar); 
    
    //todos los articulos
    let idMovimiento=0;
    let arregloError=[];
    
    let arregloMovimientoRetorno=[];
    let arregoDeCierreRetorno=[];

    tableDataArticulo.forEach((item) => {
       
      

       let sumUniEntrada=0;
       let sumCostoEntrada=0;
       let acumuladasvaloranterior=0;
       let acumuladasunitanterior=0;

       let saldoValorInicio=0;
       let saldoUnitarioInicio=0;

       let acumuladoUnidad=0;
       let acumuladoValor=0;
       let acumuladoSalidaValor=0;
       let acumuladoSalidaUnidad=0;
       let  precioPromedioFinal=0;

       console.log("valueCierre",valueCierre);

       console.log("item.id",item.id);

      


      const regCierreAnteriorArticulo = valueCierre.filter((arti=>
                              {
                                console.log("arti.articulo.id",arti.articulo.id); 
                                return arti.articulo.id===item.id && String(arti.periodo)===String(pAnterior)
                              })
                          );

       //hay registros periodo anterior
      if (regCierreAnteriorArticulo.length>0){
         
          

          console.log("hay anterior cierre para :",item.id,item.descripcion);  
          console.log("esta es la informacion ",regCierreAnteriorArticulo[0]);
            
          // setValorEntradaVal(regCierreAnteriorArticulo[0].saldovalor);
          // setValorEntradaUni(regCierreAnteriorArticulo[0].saldounitario);

         saldoUnitarioInicio=Number( regCierreAnteriorArticulo[0].saldounitario);
         saldoValorInicio=Number( regCierreAnteriorArticulo[0].saldovalor);

         acumuladasvaloranterior=Number( regCierreAnteriorArticulo[0].comprasacumuladasvaloranterior);
         acumuladasunitanterior=Number( regCierreAnteriorArticulo[0].comprasacumuladasunitanterior);
         
         //agrega periodo anterior
             
         const lineaKardex =getLineaKardex(idMovimiento++,
                'Saldo inicial',
                regCierreAnteriorArticulo[0].periodo,
                regCierreAnteriorArticulo[0].articulo.id,
                regCierreAnteriorArticulo[0].articulo.descripcion,
                "Saldo inicial",
                regCierreAnteriorArticulo[0].periodo,
                saldoUnitarioInicio,
                saldoValorInicio,
                0,
                0,
                Number( regCierreAnteriorArticulo[0].preciopromedio),
                Number( regCierreAnteriorArticulo[0].saldounitario),
                Number( regCierreAnteriorArticulo[0].saldovalor),
         );
         arregloMovimientoRetorno=[...arregloMovimientoRetorno,lineaKardex];

         acumuladoUnidad=acumuladoUnidad+Number(regCierreAnteriorArticulo[0].saldounitario);
         acumuladoValor=acumuladoValor+ Number( regCierreAnteriorArticulo[0].saldovalor)

      };    

      //consulta movimientos del articulo en el periodo
      const regMovimientoPeriodoActualArticulo = valueMovimientosPeriodo.filter((mov=>
        {
          return mov.articulo.id===item.id && String(mov.encabezadodoc.periodo)===String(pCerrar)
        })
       );

       if (regMovimientoPeriodoActualArticulo.length>0){

          console.log("hay movimiento del perioodo :",item.id,item.descripcion);  
          console.log("regCierreAnteriorArticulo  ",regCierreAnteriorArticulo);

          
          const regMovimientoPeriodoActualArticuloOrdenadoEnsa=regMovimientoPeriodoActualArticulo.sort((a, b) =>
             a.encabezadodoc.documento.ensa > b.encabezadodoc.documento.ensa   );

          //ordenar cronologicamente y por entrada
          const regMovimientoPeriodoActualArticuloOrdenadoEnsaFecha=regMovimientoPeriodoActualArticuloOrdenadoEnsa.sort((a, b) => new Date(a.encabezadodoc.fechadoc).getTime() > new Date(b.encabezadodoc.fechadoc).getTime());
         
          console.log("movimientos del periodo ordenados ",regMovimientoPeriodoActualArticuloOrdenadoEnsaFecha);
     
          acumuladoUnidad=saldoUnitarioInicio;
          acumuladoValor=saldoValorInicio;
          
          regMovimientoPeriodoActualArticuloOrdenadoEnsaFecha.forEach((item)=>{
          
              //si el documento es stock
              if (!item.encabezadodoc.documento.swEncabezadoStock ){
                  console.log("documento no es stock............");
                  return ;
              };
              //si el articulo es stock . se asume que todos son stock
              
              if (String(item.encabezadodoc.documento.ensa)==='E' ){
                //documento entrada
                console.log("sumando ....");
                sumUniEntrada=sumUniEntrada+Number(item.cantidad);
                sumCostoEntrada=sumCostoEntrada+item.costototal;

                acumuladoUnidad=acumuladoUnidad+item.cantidad;
                acumuladoValor=acumuladoValor+item.costototal;

                //agrega entrada
                const precioPromedioEntrada=Math.round(acumuladoValor/acumuladoUnidad);

                const lineaKardexE =getLineaKardex(item.id,
                  `${item.encabezadodoc.documento.descripcion}${item.encabezadodoc.foliodoc}`,
                  item.encabezadodoc.fechadoc,
                  regCierreAnteriorArticulo.length>0 ? regCierreAnteriorArticulo[0].articulo.id:{},
                  regCierreAnteriorArticulo.length>0 ? regCierreAnteriorArticulo[0].articulo.descripcion:{},
                  "Entrada",
                  item.encabezadodoc.periodo,
                  Number(item.cantidad),
                  item.costototal,
                  0,
                  0,
                  precioPromedioEntrada,
                  acumuladoUnidad,
                  acumuladoValor,
                 );

                arregloMovimientoRetorno=[...arregloMovimientoRetorno,lineaKardexE];



              }else{
                //documento salida
                //revisar si hay saldo
                if (acumuladoUnidad >= item.cantidad){
                    console.log("hay saldo .  restando...");  
                    const precioPromedio=acumuladoValor/acumuladoUnidad;
                    console.log("precioPromedio para salida",precioPromedio);

                    const valorSalidaPorPrecioPromedio=Math.round(item.cantidad*precioPromedio);

                    console.log("precio promedio salida valor =>>>>>",valorSalidaPorPrecioPromedio);

                    acumuladoUnidad=acumuladoUnidad-item.cantidad;
                    acumuladoValor=acumuladoValor-valorSalidaPorPrecioPromedio;

                    acumuladoSalidaUnidad=acumuladoSalidaUnidad+item.cantidad;
                    acumuladoSalidaValor= acumuladoSalidaValor+valorSalidaPorPrecioPromedio;


                    //agrega salida
                  //  const precioPromedioEntrada=Math.round(acumuladoValor/acumuladoUnidad);

                    const lineaKardexE =getLineaKardex(item.id,
                      `${item.encabezadodoc.documento.descripcion}${item.encabezadodoc.foliodoc}`,
                     `${item.encabezadodoc.fechadoc}`,
                      regCierreAnteriorArticulo.length>0 ? regCierreAnteriorArticulo[0].articulo.id:{},
                      regCierreAnteriorArticulo.length>0 ? regCierreAnteriorArticulo[0].articulo.descripcion:{},
                      "Salida",
                      item.encabezadodoc.periodo,
                      0,
                      0,
                      Number(item.cantidad),
                      valorSalidaPorPrecioPromedio,
                      precioPromedio,
                      acumuladoUnidad,
                      acumuladoValor,
                    );
                    
                    arregloMovimientoRetorno=[...arregloMovimientoRetorno,lineaKardexE];

                }else{

                  const lineaKardexE =getLineaKardex(idMovimiento++,
                    `${item.encabezadodoc.documento.descripcion}${item.encabezadodoc.foliodoc}`,
                    `${item.encabezadodoc.fechadoc}`,
                    regCierreAnteriorArticulo.length>0 ? regCierreAnteriorArticulo[0].articulo.id:{},
                    regCierreAnteriorArticulo.length>0 ? regCierreAnteriorArticulo[0].articulo.descripcion:{},
                    //glosa error 
                    `ERROR ... ${item.encabezadodoc.documento.descripcion}${item.encabezadodoc.foliodoc}
                     ,  saldo insuficiente acumulado , unidad ${acumuladoUnidad} , ${item.cantidad}`,
                   
                     item.encabezadodoc.periodo,
                    0,
                    0,
                    Number(item.cantidad),
                    0,
                    0,
                    acumuladoUnidad,
                    0,
                  );

                  arregloError=[...arregloError,lineaKardexE];
                  //console.log("ERROR ... de saldo insuficiente ====> acumulado , unidad ",acumuladoUnidad ,item.cantidad);
                }

              };

           });
           
        };
    
        // //valores iniciales
        console.log("saldoUnitarioInicio:",saldoUnitarioInicio);
        console.log("saldoValorInicio:", saldoValorInicio);

        //  //para entradas del mes   
        console.log("suma sumUniEntrada   :",sumUniEntrada);
        console.log("suma sumCostoEntrada :",sumCostoEntrada);

        //  //para consumo o salida del mes
        console.log("suma salida unidad :",acumuladoSalidaUnidad);
        console.log("suma salida valores: ",acumuladoSalidaValor);

        console.log("acumulado unidad  (saldo unidad ) :",acumuladoUnidad );
        console.log("acumulado valor  (saldo valor) :" ,acumuladoValor );

        if (acumuladoUnidad>0){
          precioPromedioFinal=acumuladoValor/acumuladoUnidad;

        };
        const comprasacumuladasunitanteriorP=Number(acumuladasunitanterior)+Number(sumUniEntrada);
        const comprasacumuladasvaloranteriorP=Number(acumuladasvaloranterior)+Number(sumCostoEntrada);

         const regCierre={
               articulo:item.id,
               comprasacumuladasunitanterior:comprasacumuladasunitanteriorP,
               comprasacumuladasvaloranterior:comprasacumuladasvaloranteriorP,
               comprasperiodounit:sumUniEntrada,    
               comprasperiodovalor:sumCostoEntrada,
               periodo:pCerrar,
               preciopromedio:precioPromedioFinal,
               saldounitario:acumuladoUnidad,
               saldovalor:acumuladoValor,
               salidasperiodounit:acumuladoSalidaUnidad,
               salidasperiodovalor:acumuladoSalidaValor,

            };

         arregoDeCierreRetorno=[...arregoDeCierreRetorno,regCierre];
       
         //console.log(" cierrePeriodoArticulo ====>",regCierre);
     
    });

    //console.log("Kardex   =======>>>>> ");
    //console.table(arregloMovimientoRetorno);




    return  [arregoDeCierreRetorno,arregloMovimientoRetorno,arregloError];
   // return arregoDeCierreRetorno

  };     

  export default  runCierreReport0;  