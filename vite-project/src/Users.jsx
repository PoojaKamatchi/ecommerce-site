// src/Users.jsx
import { useEffect, useState } from "react";
import api from "./api";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Users List</h2>
      <ul>
        {users.map((u, i) => (
          <li key={i}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}
