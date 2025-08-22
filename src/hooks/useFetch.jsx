import { useState,useEffect} from "react";

export const useFetch = (url) => {



        const [state, setstate] = useState({data:null,loading:true,error:null});
        
        const getFetch=async()=>{
            const resp= await fetch(url);
            const data= await resp.json(resp);

            setstate({data,loading:false,error:null});
        }

        useEffect(() => {
           setstate({...state,loading:true}); 

           getFetch();

           

        },[url] );



        return {
            data:state.data,
            loading:state.loading,
            error:state.error
        };
};
