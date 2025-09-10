import React from 'react';

const RoleControls = ({ ROLES, handleLinePick, handlePickRole, handleResetRoles, pickedRoles, availableUsersCount }) => {
  return (
    <div className="controls-section">
      <h2>라인 추첨</h2>
      <button onClick={handleLinePick} disabled={availableUsersCount < ROLES.length}>
        라인 추첨
      </button>
      {ROLES.map(role => (
        <button key={role} onClick={() => handlePickRole(role)} disabled={pickedRoles[role] || availableUsersCount === 0}>
          {role}
        </button>
      ))}
      <button onClick={handleResetRoles} className="white-button">초기화</button>
    </div>
  );
};

export default RoleControls;
