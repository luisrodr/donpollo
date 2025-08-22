//import { useState,useEffect} from "react";
import { useState,useEffect} from "react";
import axios from "axios";

export const useAxios = (url) => {
    const [state, setState] = useState({data:[],loading:true,error:null});
    
    const getAxios=async(url)=>{
        await axios
        .get(url)
        .then(({ data }) => {
            console.log("get axios");
            
            setState({data:data.data,loading:false,error:null});              
        }  )
        .catch((error) => setState({data:state.data,loading:state.loading,error}));
    }

    useEffect(() => {
       setState({...state,loading:true,error:state.error}); 

      // getAxios();

    },[url] );

    return {
        dataaxios:state.data,
        loading:state.loading,
        error:state.error,
        getAxios:getAxios
    };
};
