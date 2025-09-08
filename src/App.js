import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [allUsers, setAllUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [rouletteUsers, setRouletteUsers] = useState([]);
  const [pickedUsers, setPickedUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [showAllUsers, setShowAllUsers] = useState(false);

  useEffect(() => {
    const savedUsers = localStorage.getItem('allUsers');
    if (savedUsers) {
      setAllUsers(JSON.parse(savedUsers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
  }, [allUsers]);

  const handleUserAdd = (e) => {
    e.preventDefault();
    if (newUserName.trim() === '') return;
    setAllUsers([...allUsers, newUserName.trim()]);
    setNewUserName('');
  };

  const handleUserRemove = (index) => {
    setAllUsers(allUsers.filter((_, i) => i !== index));
  };

  const handleUserSelection = (user) => {
    const newSelectedUsers = new Set(selectedUsers);
    if (newSelectedUsers.has(user)) {
      newSelectedUsers.delete(user);
    } else {
      newSelectedUsers.add(user);
    }
    setSelectedUsers(newSelectedUsers);
  };

  const handleAddSelectedToRoulette = () => {
    setRouletteUsers([...selectedUsers]);
  };

  const handlePickOne = () => {
    if (rouletteUsers.length === 0) return;
    const randomIndex = Math.floor(Math.random() * rouletteUsers.length);
    setPickedUsers([rouletteUsers[randomIndex]]);
  };

  const handlePickFour = () => {
    if (rouletteUsers.length === 0) return;
    const shuffled = [...rouletteUsers].sort(() => 0.5 - Math.random());
    setPickedUsers(shuffled.slice(0, 4));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>룰렛</h1>
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

        <div className="user-list-section">
          <button onClick={() => setShowAllUsers(!showAllUsers)}>
            {showAllUsers ? '전체 참여자 숨기기' : '전체 참여자 보기'} ({allUsers.length}명)
          </button>
          {showAllUsers && (
            <div>
              <ul className="user-list">
                {allUsers.map((user, index) => (
                  <li key={index}>
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user)}
                      onChange={() => handleUserSelection(user)}
                    />
                    {user}
                    <button onClick={() => handleUserRemove(index)} className="remove-user-button">삭제</button>
                  </li>
                ))}
              </ul>
              <button onClick={handleAddSelectedToRoulette}>룰렛 참여자로 추가</button>
            </div>
          )}
        </div>

        <div className="user-list-section">
          <h3>룰렛 참여자 ({rouletteUsers.length}명)</h3>
          <ul className="user-list">
            {rouletteUsers.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        </div>

        <div className="controls-section">
          <h2>추첨하기</h2>
          <button onClick={handlePickOne} disabled={rouletteUsers.length < 1}>
            1명 뽑기
          </button>
          <button onClick={handlePickFour} disabled={rouletteUsers.length < 1}>
            4명 뽑기
          </button>
        </div>

        {pickedUsers.length > 0 && (
          <div className="results-section">
            <h2>추첨 결과</h2>
            <ul className="picked-users">
              {pickedUsers.map((user, index) => (
                <li key={index}>{user}</li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;