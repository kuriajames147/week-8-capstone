import { useState, useEffect } from 'react';
import api from '../services/api';
import useSocket from './useSocket';

const useTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { socket } = useSocket({
    teamUpdated: (updatedTeam) => {
      setTeams(prev => prev.map(team => 
        team._id === updatedTeam._id ? updatedTeam : team
      ));
    }
  });

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await api.get('/teams');
        setTeams(res.data);
        
        // Join all team rooms for real-time updates
        if (socket) {
          socket.emit('joinTeams', res.data.map(team => team._id));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [socket]);

  const createTeam = async (teamData) => {
    const res = await api.post('/teams', teamData);
    return res.data;
  };

  return {
    teams,
    loading,
    error,
    createTeam
  };
};

export default useTeams;