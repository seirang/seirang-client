import React from 'react';
import './ResultModal.css';

const ResultModal = ({ results, onClose }) => {
  const isTeamPick = results.length > 0 && results[0].team;

  const teams = isTeamPick ? results.reduce((acc, item) => {
    if (!acc[item.team]) {
      acc[item.team] = [];
    }
    acc[item.team].push(item.user);
    return acc;
  }, {}) : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>추첨 결과</h2>
        {isTeamPick ? (
          <div className="teams-container">
            {Object.entries(teams).map(([teamName, users]) => (
              <div key={teamName} className="team-section">
                <h3>{teamName}</h3>
                <ul>
                  {users.map((user, index) => (
                    <li key={index}>{user}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <ul className="picked-users">
            {results.map((item, index) => (
              <li key={index}>
                {item.user} {item.role && `(${item.role})`}
              </li>
            ))}
          </ul>
        )}
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default ResultModal;
