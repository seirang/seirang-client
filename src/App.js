import React, { useState, useEffect } from 'react';
import './App.css';
import backgroundImage from './Uri.png';
import ResultModal from './components/ResultModal'; // Import the new modal component

function App() {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [pickedUsers, setPickedUsers] = useState([]);
  const [showModal, setShowModal] = useState(false); // New state for modal visibility

  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const handleUserAdd = (e) => {
    e.preventDefault();
    if (newUserName.trim() === '') return;
    const names = newUserName.split(/[/,\s\n]+/).map(name => name.trim()).filter(name => name !== '');
    setUsers((prevUsers) => [...prevUsers, ...names]);
    setNewUserName('');
  };

  const handleUserRemove = (index) => {
    setUsers(users.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const names = text.split(/\r?\n/).map(name => name.trim()).filter(name => name !== '');
      setUsers((prevUsers) => [...prevUsers, ...names]);
    };
    reader.readAsText(file);
  };

  const handlePick = (count) => { // Consolidated pick logic
    if (users.length < count) return;
    const shuffled = [...users].sort(() => 0.5 - Math.random());
    setPickedUsers(shuffled.slice(0, count));
    setShowModal(true); // Show modal after picking
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPickedUsers([]); // Clear picked users when modal closes
  };

  return (
    <div className="App" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: '200px', backgroundRepeat: 'no-repeat', backgroundPosition: '65% 30%' }}>
      <header className="App-header">
        <h1>유어리 룰렛</h1>
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
          <h3>전체 참여자 ({users.length}명)</h3>
          <ul className="user-list">
            {users.map((user, index) => (
              <li key={index}>
                {user}
                <button onClick={() => handleUserRemove(index)} className="remove-user-button">삭제</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="controls-section">
          <h2>추첨하기</h2>
          <button onClick={() => handlePick(1)} disabled={users.length < 1}>
            1명 뽑기
          </button>
          <button onClick={() => handlePick(2)} disabled={users.length < 2}>
            2명 뽑기
          </button>
          <button onClick={() => handlePick(3)} disabled={users.length < 3}>
            3명 뽑기
          </button>
          <button onClick={() => handlePick(4)} disabled={users.length < 4}>
            4명 뽑기
          </button>
        </div>

        {showModal && (
          <ResultModal pickedUsers={pickedUsers} onClose={handleCloseModal} />
        )}
      </header>
    </div>
  );
}

export default App;
