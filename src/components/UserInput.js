import React from 'react';

const UserInput = ({ newUserName, setNewUserName, handleUserAdd }) => {
  return (
    <div className="user-input-section">
      <h2>참여자 등록</h2>
      <form onSubmit={handleUserAdd} className="user-form">
        <input
          type="text"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          placeholder="이름을 입력하세요"
        />
        <button type="submit">추가</button>
      </form>
    </div>
  );
};

export default UserInput;
