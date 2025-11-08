import React, { useState, useEffect } from 'react';
import './App.css';
import ResultModal from './components/ResultModal';
import UserInput from './components/UserInput';
import UserList from './components/UserList';
import PickingControls from './components/PickingControls';
import RoleControls from './components/RoleControls';

const ROLES = ['탑', '미드', '정글', '원딜', '서폿'];

function App() {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [pickedRoles, setPickedRoles] = useState({});
  const [modalResults, setModalResults] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem('users');
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      }
      const savedRoles = localStorage.getItem('pickedRoles');
      if (savedRoles) {
        setPickedRoles(JSON.parse(savedRoles));
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('pickedRoles', JSON.stringify(pickedRoles));
  }, [pickedRoles]);

  const handleUserAdd = (e) => {
    e.preventDefault();
    if (newUserName.trim() === '') return;
    const names = newUserName.split(/[/,\s\n]+/).map(name => name.trim()).filter(name => name !== '');
    const newUsers = names.filter(name => !users.includes(name));
    setUsers((prevUsers) => [...prevUsers, ...newUsers]);
    setNewUserName('');
  };

  const handleUserRemove = (userToRemove) => {
    setUsers(users.filter((user) => user !== userToRemove));
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
    setPickedRoles({});
  };

  const getAvailableUsers = () => {
    const pickedUserSet = new Set(Object.values(pickedRoles));
    return users.filter(user => !pickedUserSet.has(user));
  };

  const handlePick = (count) => {
    const availableUsers = getAvailableUsers();
    if (availableUsers.length < count) return;

    const shuffled = [...availableUsers].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, count);
    
    setModalResults(picked.map(user => ({ user })));
    setShowModal(true);
  };

  const handlePickRole = (role) => {
    const availableUsers = getAvailableUsers();
    if (availableUsers.length === 0) return;

    const randomIndex = Math.floor(Math.random() * availableUsers.length);
    const pickedUser = availableUsers[randomIndex];

    const newPickedRoles = { ...pickedRoles, [role]: pickedUser };
    setPickedRoles(newPickedRoles);
    setModalResults([{ user: pickedUser, role }]);
    setShowModal(true);
  };

  const handleLinePick = () => {
    const availableUsers = getAvailableUsers();
    if (availableUsers.length < ROLES.length) {
      alert(`라인 추첨을 위해서는 최소 ${ROLES.length}명의 참여자가 필요합니다.`);
      return;
    }

    const shuffledAvailable = [...availableUsers].sort(() => 0.5 - Math.random());
    const pickedFiveUsers = shuffledAvailable.slice(0, ROLES.length);

    const shuffledRoles = [...ROLES].sort(() => 0.5 - Math.random());
    const tempPickedRoles = {};
    const results = [];
    for (let i = 0; i < ROLES.length; i++) {
      const user = pickedFiveUsers[i];
      const role = shuffledRoles[i];
      tempPickedRoles[role] = user;
      results.push({ user, role });
    }

    setPickedRoles(tempPickedRoles);
    setModalResults(results);
    setShowModal(true);
  };

  const handleTeamPick = () => {
    const availableUsers = getAvailableUsers();
    if (availableUsers.length < 10) {
      alert('5 대 5 팀 추첨을 위해서는 최소 10명의 참여자가 필요합니다.');
      return;
    }

    const shuffled = [...availableUsers].sort(() => 0.5 - Math.random());
    const pickedTen = shuffled.slice(0, 10);
    
    const teamA = pickedTen.slice(0, 5);
    const teamB = pickedTen.slice(5, 10);

    const results = [
      ...teamA.map(user => ({ user, team: '1팀' })),
      ...teamB.map(user => ({ user, team: '2팀' })),
    ];
    
    setModalResults(results);
    setShowModal(true);
  };

  const handleResetRoles = () => {
    setPickedRoles({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalResults([]);
  };

  const availableUsersCount = getAvailableUsers().length;

  return (
    <div className="App">
      <header className="App-header">
        <h1>유어리 룰렛</h1>
        <UserInput 
          newUserName={newUserName} 
          setNewUserName={setNewUserName} 
          handleUserAdd={handleUserAdd} 
        />
        <UserList 
          users={users} 
          pickedRoles={pickedRoles} 
          handleUserRemove={handleUserRemove} 
          handleClearAllUsers={handleClearAllUsers} 
        />
        <PickingControls 
          handlePick={handlePick} 
          handleTeamPick={handleTeamPick}
          availableUsersCount={availableUsersCount} 
        />
        <RoleControls 
          ROLES={ROLES} 
          handleLinePick={handleLinePick} 
          handlePickRole={handlePickRole} 
          handleResetRoles={handleResetRoles} 
          pickedRoles={pickedRoles} 
          availableUsersCount={availableUsersCount} 
        />

        {showModal && (
          <ResultModal results={modalResults} onClose={handleCloseModal} />
        )}
      </header>
    </div>
  );
}

export default App;
