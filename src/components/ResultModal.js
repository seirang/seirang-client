import React from 'react';
import './ResultModal.css'; // We will create this CSS file next

const ResultModal = ({ pickedUsers, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>추첨 결과</h2>
        <ul className="picked-users">
          {pickedUsers.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default ResultModal;