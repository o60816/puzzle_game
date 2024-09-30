import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user data');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (users.length === 0) return <div>No users found</div>;

  return (
    <div className="user-list">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>大頭貼</th>
            <th>姓名</th>
            <th>通關時間</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.line_id}>
              <td>{index + 1}</td>
              <td>
                <img
                  src={user.image}
                  alt={user.name}
                  className="user-image"
                  style={{ width: '50px', height: '50px' }}
                />
              </td>
              <td>{user.name}</td>
              <td>{new Date(user.updated_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
