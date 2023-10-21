import React, { useState } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? e.target.files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, description, file } = formData;

    const formDataToSend = new FormData();
    formDataToSend.append("name", name);
    formDataToSend.append("description", description);
    formDataToSend.append("file", file);

    const response = axios
      .post("http://localhost:3000/createUser", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          // "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        // Handle the response from the server as needed
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input type="file" name="file" onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
