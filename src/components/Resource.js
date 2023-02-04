import React, { useState, useEffect } from "react";
import axios from "axios";

const Resource = () => {
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState({});
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    // Fetch resources from API
    const fetchResources = async () => {
      const result = await axios.get("https://jsonplaceholder.typicode.com/posts");
      setResources(result.data);
    };
    fetchResources();
  }, []);

  const handleCreate = async (resource) => {
    // Create a new resource
    const result = await axios.post("https://jsonplaceholder.typicode.com/posts", resource);
    setResources([...resources, result.data]);
  };

  const handleUpdate = async (id, updatedResource) => {
    // Update a resource
    const result = await axios.put(`https://jsonplaceholder.typicode.com/posts/${id}`, updatedResource);
    setResources(resources.map((resource) => (resource.id === id ? result.data : resource)));
  };

  const handleDelete = async (id) => {
    // Delete a resource
    await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
    setResources(resources.filter((resource) => resource.id !== id));
  };

  const handleSelectResource = (resource) => {
    setSelectedResource(resource);
    setShowUpdateForm(true);
  };

  const handleCancelUpdate = () => {
    setSelectedResource({});
    setShowUpdateForm(false);
  };

  return (
    <>
      <h1> API Resources</h1>
      {showUpdateForm ? (
        <UpdateForm
          resource={selectedResource}
          onUpdate={(updatedResource) => handleUpdate(selectedResource.id, updatedResource)}
          onCancel={handleCancelUpdate}
        />
      ) : (
        <CreateForm onCreate={handleCreate} />
      )}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <tr key={resource.id}>
              <td>{resource.id}</td>
              <td>{resource.title}</td>
              <td>
                <button
                  type="button"
                  onClick={() => handleSelectResource(resource)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(resource.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

const CreateForm = ({ onCreate }) => {
    const [resource, setResource] = useState({ title: "" });
  
    const handleChange = (event) => {
      setResource({ ...resource, [event.target.name]: event.target.value });
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      onCreate(resource);
      setResource({ title: "" });
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">
          Title:
          <input
            type="text"
            name="title"
            id="title"
            value={resource.title}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Create</button>
      </form>
    );
  };
  
  const UpdateForm = ({ resource, onUpdate, onCancel }) => {
    const [updatedResource, setUpdatedResource] = useState({ ...resource });
  
    const handleChange = (event) => {
      setUpdatedResource({ ...updatedResource, [event.target.name]: event.target.value });
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      onUpdate(updatedResource);
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">
          Title:
          <input
            type="text"
            name="title"
            id="title"
            value={updatedResource.title}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Update</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    );
  };
  
  export default Resource;
  