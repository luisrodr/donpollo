import React, { useState } from "react";
import axios from "axios";

const UploadStrapi = () => {
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

   
    const data = new FormData();
    data.append("files", file);
    const upload_res=await axios({
      method:'POST',
      url:'http://localhost:1337/upload',
      mode: "no-cors",
      data
    });

    console.log("respuesta upload",upload_res);
    console.log("respuesta upload",title);
   
   

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

export default UploadStrapi;
