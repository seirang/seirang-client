import React from 'react';

const UserList = ({ users, pickedRoles, handleUserRemove, handleClearAllUsers }) => {
  return (
    <div className="user-list-section">
      <h3>전체 참여자 ({users.length}명)</h3>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user} className={Object.values(pickedRoles).includes(user) ? 'picked-role-user' : ''}>
            {user}
            {Object.keys(pickedRoles).find(role => pickedRoles[role] === user) &&
              <span> ({Object.keys(pickedRoles).find(role => pickedRoles[role] === user)})</span>
            }
            <button onClick={() => handleUserRemove(user)} className="remove-user-button">삭제</button>
          </li>
        ))}
      </ul>
      <button onClick={handleClearAllUsers} className="white-button">전체 삭제</button>
    </div>
  );
};

export default UserList;
