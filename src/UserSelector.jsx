import React, { useState, useEffect } from "react";
import { initBackend, getUsers, addUser } from "./services/userService";

const UserSelector = () => {
  const [backend, setBackend] = useState(
    localStorage.getItem("backend") || "firebase"
  );
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initBackend(backend);
    fetchUsers();
  }, [backend]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackendChange = (e) => {
    const choice = e.target.value;
    setBackend(choice);
    localStorage.setItem("backend", choice);
  };

  const handleAddUser = async () => {
    const name = prompt("Enter surname:");
    if (!name) return;
    const login = prompt("Enter login:");
    const password = prompt("Enter password:");
    const role = prompt("Enter role:");
    await addUser({ surname: name, login, password, role });
    fetchUsers();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Management</h2>

      <div>
        <label>Select backend: </label>
        <select value={backend} onChange={handleBackendChange}>
          <option value="firebase">Firebase</option>
          <option value="server">Server</option>
        </select>
      </div>

      <button onClick={handleAddUser} style={{ marginTop: "10px" }}>
        Add User
      </button>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <ul>
          {users.map((u) => (
            <li key={u.id || u._id}>
              {u.surname} - {u.login} - {u.role}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSelector;
