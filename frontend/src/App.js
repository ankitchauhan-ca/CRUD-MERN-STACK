import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", description: "" });
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    axios
      .get("/api/items")
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error("Error While Fetching:", error);
      });
  }, []);

  /*
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("/api/items", {
        name: newItem.name,
        description: newItem.description,
      })
      .then((response) => {
        setItems([...items, response.data]);
      })
      .catch((error) => {
        console.error("Error adding item:", error);
      });
  };
  */
  //new to handle edit page
  const handleSubmit = (event) => {
    event.preventDefault();
    if (editItem) {
      // Update item
      axios
        .put(`/api/items/${editItem._id}`, newItem)
        .then((response) => {
          setItems(
            items.map((item) =>
              item._id === response.data._id ? response.data : item
            )
          );
          setNewItem({ name: "", description: "" });
          setEditItem(null);
        })
        .catch((error) => {
          console.error("Error updating item:", error);
        });
    } else {
      // Add new item
      axios
        .post("/api/items", newItem)
        .then((response) => {
          setItems([...items, response.data]);
          setNewItem({ name: "", description: "" });
        })
        .catch((error) => {
          console.error("Error adding item:", error);
        });
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`/api/items/${id}`)
      .then((response) => {
        setItems(items.filter((item) => item._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting items:", error);
      });
  };

  /*
  const handleUpdate = async () => {
    try {
      const response = await axios.put(`/api/notes/${noteId}`, {
        title,
        content,
      });
      console.log('Note updated:', response.data);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };
  */

  const handleEdit = (item) => {
    setNewItem({ name: item.name, description: item.description });
    setEditItem(item);
  };

  return (
    <div className="container">
      <h1>Items List</h1>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.name}: {item.description}
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h2>{editItem ? "Update Item" : "Add New Item"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          placeholder="Item name"
          required
        />
        <input
          type="text"
          value={newItem.description}
          onChange={(e) =>
            setNewItem({ ...newItem, description: e.target.value })
          }
          placeholder="Item description"
        />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}

export default App;
