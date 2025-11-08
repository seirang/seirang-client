import React from 'react';

const PickingControls = ({ handlePick, handleTeamPick, handlePick4TeamsOf2, handlePick8TeamsOf2, availableUsersCount }) => {
  return (
    <div className="controls-section">
      <h2>추첨하기</h2>
      {[1, 2, 3, 4, 9].map(count => (
        <button key={count} onClick={() => handlePick(count)} disabled={availableUsersCount < count}>
          {count}명 뽑기
        </button>
      ))}
      <button onClick={handleTeamPick} disabled={availableUsersCount < 10}>
        5 대 5 팀 뽑기
      </button>
      <button onClick={handlePick4TeamsOf2} disabled={availableUsersCount < 8}>
        4팀 뽑기
      </button>
      <button onClick={handlePick8TeamsOf2} disabled={availableUsersCount < 16}>
        8팀 뽑기
      </button>
    </div>
  );
};

export default PickingControls;