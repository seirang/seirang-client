import React from 'react';

const PickingControls = ({ handlePick, handleTeamPick, availableUsersCount }) => {
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
    </div>
  );
};

export default PickingControls;
