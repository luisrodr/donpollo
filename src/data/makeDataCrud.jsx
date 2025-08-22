
export const inicialUser={
  id:'new',
  firstName: '',
  lastName: '',
  email: '',
  age: 10,
  state: '',
  ciudad:{id:'' ,nombre:''},
  urlimagen:'../../assets/blanco.png'
};
export const inicialFamilia={
  id:'new',
  descripcion: '',
  codigo: '',
  title:'Familia de productos',
  subtitle:''
};
export const inicialSubFamilia={
  id:'new',
  descripcion: '',
  codigo: '',
  familia_producto:{id:'' ,descripcion:''},
  agregadosubfamiliaproducto:{id:'' ,descripcion:''},
  title:'SubFamilia de productos',
  subtitle:''
};
export const inicialAgregadoSubFamilia={
  id:'new',
  descripcion: '',
  codigo: '',
  title:'Agregado sub  familia de productos',
  subtitle:''
};
export const inicialZona={
  id:'new',
  descripcion: '',
  codigo: '',
  title:'Zona',
  subtitle:''
};
export const inicialSector={
  id:'new',
  descripcion: '',
  codigo: '',
  title:'Sector',
  subtitle:''
};
export const inicialBodega={
  id:'new',
  descripcion: '',
  codigo: '',
  title:'Bodega',
  subtitle:''
};
export const inicialDepartamento={
  id:'new',
  descripcion: '',
  codigo: '',
  title:'Departamento',
  subtitle:''
};
export const inicialCentroConsumo={
  id:'new',
  descripcion: '',
  codigo: '',
  title:'Centro consumo',
  subtitle:''
};
export const inicialOpcion={
  id:'new',
  descripcion: '',
  codigo: '',
  title:'Opcion',
  subtitle:''
};
export const inicialAccionTipoDescuento={
  id:'new',
  descripcion: '',
  codigo: '',
  title:'Accion tipo descuento',
  subtitle:''
};
export const inicialTipoProducto={
  id:'new',
  descripcion: '',
  codigo: '',
  title:'Tipo producto',
  subtitle:''
};
export const inicialFamiliaArticulo={
  id:'new',
  descripcion: '',
  codigo: '',
  title:'Familia de articulos',
  subtitle:'',
  siguientesubfamilia:0,
};
export const inicialSubFamiliaArticulo={
  id:'new',
  descripcion: '',
  codigo: '',
  familiaarticulo:{id:'' ,descripcion:''},
  title:'SubFamilia de articulos',
  subtitle:'',
  siguientecodigo:0,
};
export const inicialEstadoMesa={
  id:'new',
  descripcion: '',
  codigo: '',
  title:'Estado Mesa',
  subtitle:''
};
export const inicialPlaza={
  id:'new',
  descripcion: '',
  codigo: '',
  sector:{id:'' ,descripcion:''},
  title:'Plaza',
  subtitle:''
};
export const inicialTerminal={
  id:'new',
  descripcion: '',
  codigo: '',
  funcion:'',
  programa:'',
  argumento:'',
  departamento:{id:'' ,descripcion:''},
  title:'Terminal',
  subtitle:''
};
export const inicialCondicionPago={
  id:'new',
  descripcion: '',
  codigo: '',
  dias:0,
  title:'Condicion pago',
  subtitle:''
};

export const inicialImpresora={
  id:'new',
  codigo: '',
  descripcion: '',
  puerta:'',
  habilita:'',
  deshabilita:'',
  comandopre:'',
  comandopos:'',
  title:'Impresora',
  subtitle:''
};

export const inicialVendedor={
  id:'new',
  descripcion: '',
  codigo: '',
  clave:'',
  descuentolinea:true,
  descuentototal:true,
  comision:0.0,
  title:'Vendedor',
  subtitle:''
};
export const inicialTipoDescuento={
  id:'new',
  descripcion: '',
  codigo: '',
  acciontipodescuento:{id:'' ,descripcion:''},
  title:'Tipo descuento',
  subtitle:''
};
export const inicialDescuento={
  id:'new',
  codigo: '',
  descripcion: '',          
  tipodescuento:{id:'' ,descripcion:''},
  title:'Descuento',
  subtitle:''       
};           
export const inicialIp={
  id:'new',
  title:'Ip',
  subtitle:'',
  nombre:'',
  equipo:'',
  ip:'',       
  detalle:'',
  lugar:{id:'' ,descripcion:''},

};               
export const inicialDocumento={
  id:'new',
  descripcion: '',
  cosa:'',
  codigo: '',
  folioinicial:0,
  foliofinal:0,    
  siguiente:0, 
  sistemaimpresora:'',
  lock:true,
  title:'Tipo documento',
  subtitle:'',
  swEncabezadoVencimiento:false,
  swEncabezadoDocumentoActual:false,
  swEncabezadoProveedor:false,
  swEncabezadoDocumentoRelacionado:false,
  swEncabezadoBodega:false,
  swEncabezadoCentroConsumo:false,
  swEncabezadoCentroProduccion:false,
  swEncabezadoDescuento:false,
  swEncabezadoRecargo:false,
  swEncabezadoStock:false,
  swEncabezadoEntradaSalida:false,

  swEncabezadoRelacionaDocumento:false,
  swEncabezadoActualizaPrecio:false,
  

  swDetalleBodega:false,
  swDetalleExento:false,
  swDetalleNeto:false,
  swDetalleIla:false,
  swDetalleDescuento:false,
  swDetalleRecargo:false,
  swDetalleArticulo:false,
  swDetalleProducto:false,
  swDetallePrecio:false,
  swDetalleCostounitario:false,
  swDetalleRecargoglobal:false,
  swDetalleCostototal:false,
  swDetalleRetencion:false,
  ensa:'',  


};

export const inicialMesa={
  id:'new',
  codigo: '',
  asientos:0,
  plaza:{id:'' ,descripcion:''},
  estadomesa:{id:'' ,descripcion:''},
  title:'Mesa',
  subtitle:''
};
export const inicialListaPrecio={
  id:'new',
  codigo: '',
  descripcion: '',
  condicionpago:{id:'' ,descripcion:''},
  factor:0,
  title:'Lista precio',
  subtitle:''
};

export const inicialCentroProduccion={
  id:'new',
  codigo: '',
  descripcion: '',
  impresora:{id:'' ,descripcion:''},
  bodega:{id:'' ,descripcion:''},
  title:'Centro produccion',
  subtitle:'',
  centroproimps:[]
};

export const inicialImpresoraDocumentoFolio={
  id:'new',
  folioinicial:0,
  foliofinal:0,    
  siguiente:0, 
  impresora:{id:'' ,descripcion:''},
  documento:{id:'' ,descripcion:''},
  lock:true,
  title:'Impresora documento folio',
  subtitle:''
};
export const inicialComunaSii={
  id:'new',
  descripcion: '',
  codigo: '',
  codigosii:'',
  title:'Comuna Sii',
  subtitle:''
};
export const inicialArticulo={
  id:'new',
  descripcion: '',
  codigo: '',

  codigodebarra:'',
  unidaddemedida:'',
  ubicacion:'',
  
  precio:0,
  preciodeventa:0,
  costopromedio:0,
  maximodescuento:0,
  modificapreciodeventa:false,
  stockmin:0,
  stockmax:0,
  tasaila:0,

  fechaultimaventa:'',
  ventasdelmes:0,
  ventasacumuladas:0,

  fechacumayor:'',
  cunipromedio:0,
  cunitmayor:0,
  costostock:0,
  stocktotal:0,

  fechaultimacompra:'',
  comprasdelmes:0,
  comprasacumuladas:0,
  
  subfamilia_articulo:{id:'' ,descripcion:''},

  bodega:{id:'' ,descripcion:''},

  base:false,
  urlimagen:'../../assets/blanco.png',
  title:'Articulo',
  subtitle:'',
  codigoproveedor:'',
  produccioninterna:false
};

export const inicialProducto={

  id:'new',
  descripcion: '',
  codigo: '',
  codigoingresocomanda:'',  
  unidaddemedida:'',
  preciodeventa:0,
  precio:0,
  modificapreciodeventa:false,

  costopromedio:0,
  fechaultimaventa:'',
  maximodescuento:0,
  ventasdelmes:0,
  ventasacumuladas:0,

  subfamilia_producto:{id:'' ,descripcion:''},
  tipoproducto:{id:'' ,descripcion:''},

  urlimagen:'../../assets/blanco.png',
  title:'Producto',
  subtitle:''

};

export const inicialProveedor={

  id:'new',
  rut:'',
  codigo:'',
  razonsocial: '',
 
  giro:'',
  direccion:'',
  ciudad:'',
  
  telefono:'',
  email:'',
  nombre:'',

  ultimacompra:0,
  comprames:0,

  title:'Proveedor',
  subtitle:''
};

export const inicialCliente={

  id:'new',
  rut:'',
  codigo:'',
  razonsocial: '',
 
  giro:'',
  direccion:'',
  ciudad:'',
  
  telefono:'',
  email:'',
  nombre:'',

  ultimaventa:0,
  ventames:0,

  condicionpago:{id:'' ,descripcion:''},
  title:'Cliente',
  subtitle:''
};

export const inicialEncabezadoDoc={
  id:'new',
  title:'Documentos',
  subtitle:'',
 
  movimientodocs:[],
  
  fechadoc:'',
  documento:{},
  foliodocumentoactual:'',
  proveedor:{},
  centroproduccion:{},
  centroconsumo:{},
  bodega:{},
  neto:0,
  exento:0, 
  total:0,
  siva:0,
  sila:0,
  sretencion:0,
  documentosrelacionado:{},
  foliodocrel:'',
  tasaila:{},
  foliointerno:'',
  users_permissions_user:'',

};
export const inicialParametro={
  id:'new',
  siguientefamiliaarticulo:0,
  siguientefamiliaproducto:0,

  iva:19,
  mesproceso:'',
  diasadicionalperiodoactual:0,
  comportamientogeneral:"",
  empresa:"",
 
};

export const inicialTablaIla={
  id:'new',
  descripcion: '',
  codigo: '',
  title:'Tabla Ila',
  subtitle:'',
  tasa:0
};
/*
struct Factura {
  tipo: String,
  numero:String,
  folio:String,
  fecha:String,
  periodo:String,
  razonsocia: String,
  rut:String,
  total:i32,
  imagen:String

}
*/
export const inicialFacturas={
  title:'Facturas de Compra Chorombo',
  subtitle:'',
  id:'new',
  tipo: "",
  numero:"",
  folio:"",
  fecha:"",
  periodo:"",
  razonsocia: "",
  rut:"",
  total:0,
  imagen:""
};




export const mesesNumero=
[ {id:1  ,mes:'Enero' ,numeromes:'01'},
  {id:2  ,mes:'Febrero' ,numeromes:'02'},
  {id:3  ,mes:'Marzo' ,numeromes:'03'},
  {id:4  ,mes:'Abril' ,numeromes:'04'},
  {id:5  ,mes:'Mayo' ,numeromes:'05'},
  {id:6  ,mes:'Junio' ,numeromes:'06'},
  {id:7  ,mes:'Julio' ,numeromes:'07'},
  {id:8  ,mes:'Agosto' ,numeromes:'08'},
  {id:9  ,mes:'Septiembre' ,numeromes:'09'},
  {id:10 ,mes:'Octubre' ,numeromes:'10'},
  {id:11 ,mes:'Noviembre' ,numeromes:'11'},
  {id:12 ,mes:'Diciembre' ,numeromes:'12'},
];

export const statescid = [
  {id:'Alabama' ,nameState:'Alabama'},
  {id:'Alaska',nameState:'Alaska'},
  {id:'Arizona',nameState:'Arizona'},
  {id:'Arkansas',nameState:'Arkansas'},
  {id:'California',nameState:'California'},
  {id:'Colorado',nameState:'Colorado'},
  {id:'Connecticut',nameState:'Connecticut'},
];
//50 us states array
export const states = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
  'Puerto Rico',
];
export const currencies = [
  {
    value: "USD",
    label: "$"
  },
  {
    value: "EUR",
    label: "€"
  },
  {
    value: "BTC",
    label: "฿"
  },
  {
    value: "JPY",
    label: "¥"
  }
];

export const data  = [
  {
    id: '9s41rp',
    firstName: 'Kelvin',
    lastName: 'Langosh',
    email: 'Jerod14@hotmail.com',
    age: 19,
    state: 'Ohio',
  },
  {
    id: '08m6rx',
    firstName: 'Molly',
    lastName: 'Purdy',
    email: 'Hugh.Dach79@hotmail.com',
    age: 37,
    state: 'Rhode Island',
  },
  {
    id: '5ymtrc',
    firstName: 'Henry',
    lastName: 'Lynch',
    email: 'Camden.Macejkovic@yahoo.com',
    age: 20,
    state: 'California',
  },
  {
    id: 'ek5b97',
    firstName: 'Glenda',
    lastName: 'Douglas',
    email: 'Eric0@yahoo.com',
    age: 38,
    state: 'Montana',
  },
  {
    id: 'xxtydd',
    firstName: 'Leone',
    lastName: 'Williamson',
    email: 'Ericka_Mueller52@yahoo.com',
    age: 19,
    state: 'Colorado',
  },
  {
    id: 'wzxj9m',
    firstName: 'Mckenna',
    lastName: 'Friesen',
    email: 'Veda_Feeney@yahoo.com',
    age: 34,
    state: 'New York',
  },
  {
    id: '21dwtz',
    firstName: 'Wyman',
    lastName: 'Jast',
    email: 'Melvin.Pacocha@yahoo.com',
    age: 23,
    state: 'Montana',
  },
  {
    id: 'o8oe4k',
    firstName: 'Janick',
    lastName: 'Willms',
    email: 'Delfina12@gmail.com',
    age: 25,
    state: 'Nebraska',
  },
];
/*
export const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
  },
  {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
  },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  {
    title: 'The Lord of the Rings: The Two Towers',
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  {
    title: 'Star Wars: Episode IV - A New Hope',
    year: 1977,
  },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
  { title: 'Casablanca', year: 1942 },
  { title: 'City Lights', year: 1931 },
  { title: 'Psycho', year: 1960 },
  { title: 'The Green Mile', year: 1999 },
  { title: 'The Intouchables', year: 2011 },
  { title: 'Modern Times', year: 1936 },
  { title: 'Raiders of the Lost Ark', year: 1981 },
  { title: 'Rear Window', year: 1954 },
  { title: 'The Pianist', year: 2002 },
  { title: 'The Departed', year: 2006 },
  { title: 'Terminator 2: Judgment Day', year: 1991 },
  { title: 'Back to the Future', year: 1985 },
  { title: 'Whiplash', year: 2014 },
  { title: 'Gladiator', year: 2000 },
  { title: 'Memento', year: 2000 },
  { title: 'The Prestige', year: 2006 },
  { title: 'The Lion King', year: 1994 },
  { title: 'Apocalypse Now', year: 1979 },
  { title: 'Alien', year: 1979 },
  { title: 'Sunset Boulevard', year: 1950 },
  {
    title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
    year: 1964,
  },
  { title: 'The Great Dictator', year: 1940 },
  { title: 'Cinema Paradiso', year: 1988 },
  { title: 'The Lives of Others', year: 2006 },
  { title: 'Grave of the Fireflies', year: 1988 },
  { title: 'Paths of Glory', year: 1957 },
  { title: 'Django Unchained', year: 2012 },
  { title: 'The Shining', year: 1980 },
  { title: 'WALL·E', year: 2008 },
  { title: 'American Beauty', year: 1999 },
  { title: 'The Dark Knight Rises', year: 2012 },
  { title: 'Princess Mononoke', year: 1997 },
  { title: 'Aliens', year: 1986 },
  { title: 'Oldboy', year: 2003 },
  { title: 'Once Upon a Time in America', year: 1984 },
  { title: 'Witness for the Prosecution', year: 1957 },
  { title: 'Das Boot', year: 1981 },
  { title: 'Citizen Kane', year: 1941 },
  { title: 'North by Northwest', year: 1959 },
  { title: 'Vertigo', year: 1958 },
  {
    title: 'Star Wars: Episode VI - Return of the Jedi',
    year: 1983,
  },
  { title: 'Reservoir Dogs', year: 1992 },
  { title: 'Braveheart', year: 1995 },
  { title: 'M', year: 1931 },
  { title: 'Requiem for a Dream', year: 2000 },
  { title: 'Amélie', year: 2001 },
  { title: 'A Clockwork Orange', year: 1971 },
  { title: 'Like Stars on Earth', year: 2007 },
  { title: 'Taxi Driver', year: 1976 },
  { title: 'Lawrence of Arabia', year: 1962 },
  { title: 'Double Indemnity', year: 1944 },
  {
    title: 'Eternal Sunshine of the Spotless Mind',
    year: 2004,
  },
  { title: 'Amadeus', year: 1984 },
  { title: 'To Kill a Mockingbird', year: 1962 },
  { title: 'Toy Story 3', year: 2010 },
  { title: 'Logan', year: 2017 },
  { title: 'Full Metal Jacket', year: 1987 },
  { title: 'Dangal', year: 2016 },
  { title: 'The Sting', year: 1973 },
  { title: '2001: A Space Odyssey', year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: 'Toy Story', year: 1995 },
  { title: 'Bicycle Thieves', year: 1948 },
  { title: 'The Kid', year: 1921 },
  { title: 'Inglourious Basterds', year: 2009 },
  { title: 'Snatch', year: 2000 },
  { title: '3 Idiots', year: 2009 },
  { title: 'Monty Python and the Holy Grail', year: 1975 },
];

export const top100Films = [
  { title: 'producto 1', id: 1994 ,precio:1555 ,tasaila:30 },
  { title: 'producto 2', id: 1972 ,precio: 1972 ,tasaila:30},
  { title: 'producto 3',id: 1974 , precio: 1974,tasaila:45 },
  { title: 'producto 4',  id: 2008, precio: 2008,tasaila:24 },
  { title: 'producto 5', id: 20088, precio: 25008 ,tasaila:25},
  { title: "producto 6", id: 20078, precio: 82008 ,tasaila:34 },
  { title: 'producto 7', id: 20, precio: 8008 ,tasaila:34 }];

export const bodegas = [
  { title: 'bodega 1', id: 1994 },
  { title: 'bodega 2', id: 1972 },
  { title: 'bodega 3', id: 1973 },
  { title: 'bodega 4', id: 1974 },
  { title: 'bodega 5', id: 1975 },
  { title: 'bodega 6', id: 1976 },
  { title: 'bodega 7', id: 1977 },
  { title: 'bodega 8', id: 1978 },
];

export const proveedores = [
  {rut:'11886444-1', title: 'proveedor 1', id: 10  },
  {rut:'12175496-7', title: 'proveedor  2', id: 11 },
  {rut:'11834544-1', title: 'proveedor  3', id: 12 },
  {rut:'11883453-1', title: 'proveedor  4', id: 13 },
  {rut:'11343453-1', title: 'proveedor  5', id: 14 },
  {rut:'16456445-1', title: 'proveedor  6', id: 15 },
  {rut:'56757456-1', title: 'proveedor  7', id: 16 },
  {rut:'17547457-1', title: 'proveedor  8', id: 17 },
];

export const centroproduccion = [
  { title: 'centroproduccion 1', id: 1994 },
  { title: 'centroproduccion 2', id: 1972 },
  { title: 'centroproduccion 3', id: 1973 },
  { title: 'centroproduccion 4', id: 1974 },
  { title: 'centroproduccion 5', id: 1975 },
  { title: 'centroproduccion 6', id: 1976 },
  { title: 'centroproduccion 7', id: 1977 },
  { title: 'centroproduccion 8', id: 1978 },
];

export const centroconsumo = [
  { title: 'centroconsumo 1', id: 1994 },
  { title: 'centroconsumo 2', id: 1972 },
  { title: 'centroconsumo 3', id: 1973 },
  { title: 'centroconsumo 4', id: 1974 },
  { title: 'centroconsumo 5', id: 1975 },
  { title: 'centroconsumo 6', id: 1976 },
  { title: 'centroconsumo 7', id: 1977 },
  { title: 'centroconsumo 8', id: 1978 },
];



export const documentos = [
  { descripcion: 'tipo documento 1', id: 10 },
  { descripcion: 'tipo documento 2', id: 20 },
  { descripcion: 'tipo documento 3', id: 30 },
  { descripcion: 'tipo documento 4', id: 40 },
  { descripcion: 'tipo documento 5', id: 50 },
  { descripcion: 'tipo documento 6', id: 51 },
  { descripcion: 'tipo documento 7', id: 52 },
  { descripcion: 'tipo documento 8', id: 53 },
];

export const cosas = [
  { descripcion: 'articulos', id: 10 },
  { descripcion: 'productos', id: 20 },
 
];
*/