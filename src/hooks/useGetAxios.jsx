import { useState,useEffect} from "react";
import axios from "axios";

export const useGetAxios = (url) => {

        const [state, setState] = useState({data:[],loading:true,error:null});
    
        const getAxios=async()=>{
            await axios
            .get(url)
            .then(({ data }) => {
                
                setState({data:data.data,loading:false,error:null});              
            }  )
            .catch((error) => setState({data:state.data,loading:state.loading,error}));
        }

        useEffect(() => {
           setState({...state,loading:true,error:state.error}); 

           getAxios();

        },[url] );

        return {
            data:state.data,
            loading:state.loading,
            error:state.error
        };
};
