import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCount, setUserCount] = useState(0); // {{ edit_1 }}

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data);
        setUserCount(response.data.length); // {{ edit_2 }}
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
      <h1>掃描以下QR Code加入遊戲</h1>
      <img src='https://lh3.googleusercontent.com/pw/AP1GczOpgn-Mhe2ItyhqWMYpYFlsH_-PKq9WaNFcoA2Q9svt_SOxnJ8GdhjnUDL62CdevwfZI139srFVPKjkP3wJ2GBTOO6KZAVSS4Ik7DUaNWReapx5tiUlz7iUyUmorryk5nalnw0LlhN0JgZR8Rlj3gKFOg=w360-h360-s-no-gm?authuser=0'></img>
      <h2>參與人數: {userCount}</h2> {/* {{ edit_3 }} */}
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>大頭貼</th>
            <th>姓名</th>
            <th>加入時間</th>
          </tr>
        </thead>
        <tbody>
          {users
            .map((user, index) => (
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
                <td>{new Date(user.created_at).toLocaleString()}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
