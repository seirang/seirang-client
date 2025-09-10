import React from 'react';

const PickingControls = ({ handlePick, availableUsersCount }) => {
  return (
    <div className="controls-section">
      <h2>추첨하기</h2>
      {[1, 2, 3, 4].map(count => (
        <button key={count} onClick={() => handlePick(count)} disabled={availableUsersCount < count}>
          {count}명 뽑기
        </button>
      ))}
    </div>
  );
};

export default PickingControls;
