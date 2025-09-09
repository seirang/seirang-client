import React, { useState, useEffect } from 'react';
import './App.css';
import backgroundImage from './Uri.png';
import ResultModal from './components/ResultModal'; // Import the new modal component

function App() {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [pickedUsers, setPickedUsers] = useState([]);
  const [showModal, setShowModal] = useState(false); // New state for modal visibility
  const [pickedRoles, setPickedRoles] = useState({}); // New state for role assignments

  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // Effect to update pickedUsers for modal and availableUsers when users or pickedRoles change
  useEffect(() => {
    const currentlyPickedUsers = Object.values(pickedRoles);
    setPickedUsers(currentlyPickedUsers);

    const newAvailableUsers = users.filter(user => !currentlyPickedUsers.includes(user));
    // Only update if truly different to avoid infinite loops
    // This check is a bit tricky with arrays, but for simple strings, includes works.
    // A more robust check would involve comparing array contents.
    if (JSON.stringify(newAvailableUsers) !== JSON.stringify(users.filter(user => !Object.values(pickedRoles).includes(user)))) {
        // This is a simplified check, ideally you'd compare the actual content of the arrays
        // to prevent unnecessary re-renders if the order changes but content is same.
        // For now, we'll rely on the fact that pickedRoles changes will trigger this.
    }
  }, [users, pickedRoles]);

  const handleUserAdd = (e) => {
    e.preventDefault();
    if (newUserName.trim() === '') return;
    const names = newUserName.split(/[/,\s\n]+/).map(name => name.trim()).filter(name => name !== '');
    setUsers((prevUsers) => [...prevUsers, ...names]);
    setNewUserName('');
  };

  const handleUserRemove = (index) => {
    const userToRemove = users[index];
    setUsers(users.filter((_, i) => i !== index));
    // Also remove from pickedRoles if this user was assigned a role
    const newPickedRoles = { ...pickedRoles };
    for (const role in newPickedRoles) {
      if (newPickedRoles[role] === userToRemove) {
        delete newPickedRoles[role];
      }
    }
    setPickedRoles(newPickedRoles);
  };

  const handleClearAllUsers = () => {
    setUsers([]);
    setPickedRoles({}); // Clear all role assignments too
  };

  const handlePick = (count) => { // Consolidated pick logic for general picks
    const currentlyPickedUsers = Object.values(pickedRoles);
    const availableForGeneralPick = users.filter(user => !currentlyPickedUsers.includes(user));

    if (availableForGeneralPick.length < count) return;
    const shuffled = [...availableForGeneralPick].sort(() => 0.5 - Math.random());
    setPickedUsers(shuffled.slice(0, count));
    setShowModal(true); // Show modal after picking
  };

  const handlePickRole = (role) => {
    const currentlyPickedUsers = Object.values(pickedRoles);
    const availableUsersForRole = users.filter(user => !currentlyPickedUsers.includes(user));

    if (availableUsersForRole.length === 0) return;

    const randomIndex = Math.floor(Math.random() * availableUsersForRole.length);
    const pickedUser = availableUsersForRole[randomIndex];

    setPickedRoles(prevRoles => ({ ...prevRoles, [role]: pickedUser }));
    setShowModal(true); // Show modal with the updated pickedUsers (from useEffect)
  };

  const handleLinePick = () => {
    const roles = ['탑', '미드', '정글', '원딜', '서폿'];
    let tempPickedRoles = {};
    let availableUsersForLinePick = [...users]; // Start with all current users

    // 1. Assign '유어리' to a random role
    const yuriyRoleIndex = Math.floor(Math.random() * roles.length);
    const yuriyRole = roles[yuriyRoleIndex];
    tempPickedRoles[yuriyRole] = '유어리';

    // Remove the assigned role from the list of roles to be filled by others
    const remainingRoles = roles.filter(role => role !== yuriyRole);

    // Ensure '유어리' is not picked from the available users if they happen to be in the list
    availableUsersForLinePick = availableUsersForLinePick.filter(user => user !== '유어리');

    // 2. Pick remaining 4 users for remaining roles
    // Filter out users already assigned a role (only '유어리' at this point) 
    const currentlyPickedForRoles = Object.values(tempPickedRoles);
    const trulyAvailable = availableUsersForLinePick.filter(user => !currentlyPickedForRoles.includes(user));

    if (trulyAvailable.length < 4) {
      alert('라인 추첨을 위해서는 최소 4명의 다른 참여자가 필요합니다.');
      return;
    }

    const shuffledAvailable = [...trulyAvailable].sort(() => 0.5 - Math.random());
    const pickedFourUsers = shuffledAvailable.slice(0, 4);

    // 3. Assign remaining picked users to remaining roles
    for (let i = 0; i < remainingRoles.length; i++) {
      tempPickedRoles[remainingRoles[i]] = pickedFourUsers[i];
    }

    setPickedRoles(tempPickedRoles);
    setShowModal(true);
  };

  const handleResetRoles = () => {
    setPickedRoles({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // pickedUsers are updated by useEffect based on pickedRoles, no need to clear here
  };

  return (
    <div className="App" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: '500px', backgroundRepeat: 'no-repeat', backgroundPosition: '120px 50px' }}>
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
              <li key={index} className={Object.values(pickedRoles).includes(user) ? 'picked-role-user' : ''}>
                {user}
                {Object.keys(pickedRoles).find(role => pickedRoles[role] === user) &&
                  <span> ({Object.keys(pickedRoles).find(role => pickedRoles[role] === user)})</span>
                }
                <button onClick={() => handleUserRemove(index)} className="remove-user-button">삭제</button>
              </li>
            ))}
          </ul>
          <button onClick={handleClearAllUsers} className="white-button">전체 삭제</button>
        </div>

        <div className="controls-section">
          <h2>추첨하기</h2>
          <button onClick={() => handlePick(1)} disabled={users.length < 1 || Object.values(pickedRoles).length === users.length}>
            1명 뽑기
          </button>
          <button onClick={() => handlePick(2)} disabled={users.length < 2 || Object.values(pickedRoles).length === users.length -1 || Object.values(pickedRoles).length === users.length}>
            2명 뽑기
          </button>
          <button onClick={() => handlePick(3)} disabled={users.length < 3 || Object.values(pickedRoles).length === users.length -2 || Object.values(pickedRoles).length === users.length -1 || Object.values(pickedRoles).length === users.length}>
            3명 뽑기
          </button>
          <button onClick={() => handlePick(4)} disabled={users.length < 4 || Object.values(pickedRoles).length === users.length -3 || Object.values(pickedRoles).length === users.length -2 || Object.values(pickedRoles).length === users.length -1 || Object.values(pickedRoles).length === users.length}>
            4명 뽑기
          </button>
        </div>

        <div className="controls-section">
          <h2>라인 추첨</h2>
          <button onClick={handleLinePick} disabled={users.length < 4 || Object.values(pickedRoles).length === users.length}>
            라인 추첨
          </button>
          <button onClick={() => handlePickRole('탑')} disabled={users.length === 0 || pickedRoles['탑'] || Object.values(pickedRoles).length === users.length}>
            탑
          </button>
          <button onClick={() => handlePickRole('미드')} disabled={users.length === 0 || pickedRoles['미드'] || Object.values(pickedRoles).length === users.length}>
            미드
          </button>
          <button onClick={() => handlePickRole('정글')} disabled={users.length === 0 || pickedRoles['정글'] || Object.values(pickedRoles).length === users.length}>
            정글
          </button>
          <button onClick={() => handlePickRole('원딜')} disabled={users.length === 0 || pickedRoles['원딜'] || Object.values(pickedRoles).length === users.length}>
            원딜
          </button>
          <button onClick={() => handlePickRole('서폿')} disabled={users.length === 0 || pickedRoles['서폿'] || Object.values(pickedRoles).length === users.length}>
            서폿
          </button>
          <button onClick={handleResetRoles} className="white-button">초기화</button>
        </div>

        {showModal && (
          <ResultModal pickedRoles={pickedRoles} onClose={handleCloseModal} />
        )}
      </header>
    </div>
  );
}

export default App;