const TeamList = ({ teams, selectedTeam, onSelectTeam }) => {
  return (
    <div className="team-list">
      {teams.map(team => (
        <div 
          key={team._id} 
          className={`team-item ${selectedTeam === team._id ? 'active' : ''}`}
          onClick={() => onSelectTeam(team._id)}
        >
          {team.name}
        </div>
      ))}
    </div>
  );
};

export default TeamList;