import { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:1337/api';


export const useAxios = (axiosParams) => {
    const [response, setResponse] = useState([]);
    const [error, setError] = useState('');
    const [loading, setloading] = useState(true);

    const fetchData = async (params) => {
      try {
       const result = await axios.request(params);
       setResponse(result.data);
      
       } catch( error ) {
         setError(error);
       } finally {
         setloading(false);
       }
    };

    useEffect(() => {
       
            console.log("axiosParams"); 
            fetchData(axiosParams);
      

    }, [axiosParams]); // execute once only

    return { response, error, loading };
};