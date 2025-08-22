import React, { useState } from "react";
import axios from "axios";


const UploadBin = () => {
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
   
    const cloudUrl='http://localhost:8000';

    const formData = new FormData();
    formData.append("file", file[0]);

    const resp=await fetch(cloudUrl,{
      method:'POST',
      mode: "no-cors",
      body:formData      
    });


    console.log("respuesta upload",resp);
    console.log("respuesta upload",title)
    
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

export default UploadBin;
