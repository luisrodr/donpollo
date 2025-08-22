import React, { useState } from "react";
import axios from "axios";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [title, settitle] = useState("titulo");

  const handleFileChange = event => {
    
    setFile(event.target.files[0]);
    
  };

  const handleTitleChange = event => {
    settitle(event.target.value);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    console.log(file);
    /*
    const data = {
        title: title
      };

    axios
    .post(`http://localhost:1337/api/posts?populate=*`, {

      data:data ,
    })
    .then((response) => {
        console.log(response);
      
        const formData = new FormData();
        formData.append("files", file);
        const id = response.data.data.id;
        formData.append("ref", "post"); //name of content type
        formData.append("refId", id); //id of content type
        formData.append("field", "image"); 


        axios
        .post(`http://localhost:1337/upload`, {body: formData})
        .then((response) => {
            console.log(response);
          
    
        }).catch((error) => {
    
            console.log(error);
     
    
        });
        

    }).catch((error) => {

        console.log(error);
    });

    */
   /*
    const data = new FormData();
    data.append("files", file);
    const upload_res=await axios({
      method:'POST',
      url:'http://localhost:1337/upload',
      data
    });

    console.log("respuesta upload",upload_res);
    */
    const cloudUrl='https://api.cloudinary.com/v1_1/ddclbv5eb/upload';

    const formData=new FormData();
    formData.append('upload_preset','react-faster');
    formData.append('file',file);

    try {
        const resp=await fetch(cloudUrl,{
              method:'POST',
              body:formData      
        });

        if (resp.ok){
            const cloudResp=await resp.json();
            console.log("desde cloudinari", cloudResp);
            //console.log(cloudResp.secure_url);
            //return cloudResp.secure_url;
        }else{
           //para test 
           return null; 
           // throw await resp.json();
        };
        
    } catch (error) {
        throw error;
    }

  };

  return (
    <div className="FileUpload">
      <form onSubmit={handleSubmit}>
        <input onChange={handleFileChange} type="file" />

        <input
          type="text"
          placeholder="title"
          name="title"
          onChange={handleTitleChange}
        />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default Upload;
