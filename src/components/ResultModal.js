import React from 'react';
import './ResultModal.css';

const ResultModal = ({ results, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>추첨 결과</h2>
        <ul className="picked-users">
          {results.map((item, index) => (
            <li key={index}>
              {item.user} {item.role && `(${item.role})`}
            </li>
          ))}
        </ul>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default ResultModal;
