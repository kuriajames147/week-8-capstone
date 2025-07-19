import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import TaskList from '../components/tasks/TaskList';
import TeamList from '../components/teams/TeamList';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, teamsRes] = await Promise.all([
          api.get('/tasks'),
          api.get('/teams')
        ]);
        setTasks(tasksRes.data);
        setTeams(teamsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h3>Your Teams</h3>
        <TeamList 
          teams={teams} 
          selectedTeam={selectedTeam}
          onSelectTeam={setSelectedTeam}
        />
      </div>
      <div className="main-content">
        <h2>{selectedTeam ? 'Team Tasks' : 'All Tasks'}</h2>
        <TaskList 
          tasks={selectedTeam 
            ? tasks.filter(task => task.team === selectedTeam)
            : tasks
          } 
        />
      </div>
    </div>
  );
};

export default Dashboard;