import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';

const DashboardPage = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const handleApiError = (error, fallbackMessage) => {
    if (error?.response?.status === 401) {
      logoutUser();
      navigate('/login', { replace: true });
      return;
    }
    setAlert({ type: 'error', message: getErrorMessage(error, fallbackMessage) });
  };

  useEffect(() => {
    let ignore = false;

    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/tasks');
        if (!ignore) {
          setTasks(response.data.data || []);
        }
      } catch (err) {
        if (!ignore) {
          handleApiError(err, 'Failed to load tasks.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchTasks();
    return () => {
      ignore = true;
    };
  }, []);

  const handleCreateTask = async (taskData) => {
    setIsCreating(true);
    try {
      const response = await api.post('/tasks', taskData);
      const created = response.data.data;
      setTasks((prev) => [created, ...prev]);
      setAlert({ type: 'success', message: response.data.message || 'Task created successfully.' });
      return true;
    } catch (err) {
      handleApiError(err, 'Failed to create task.');
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, updates);
      const updated = response.data.data;
      setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
      setAlert({ type: 'success', message: response.data.message || 'Task updated successfully.' });
      return true;
    } catch (err) {
      handleApiError(err, 'Failed to update task.');
      return false;
    }
  };

  const handleToggleComplete = async (task) => {
    const nextCompleted = !task.completed;
    try {
      const response = await api.put(`/tasks/${task._id}`, { completed: nextCompleted });
      const updated = response.data.data;
      setTasks((prev) => prev.map((t) => (t._id === task._id ? updated : t)));
      setAlert({
        type: 'success',
        message: nextCompleted ? 'Task marked as completed.' : 'Task marked as pending.',
      });
    } catch (err) {
      handleApiError(err, 'Failed to update task status.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      setAlert({ type: 'success', message: response.data.message || 'Task deleted successfully.' });
    } catch (err) {
      handleApiError(err, 'Failed to delete task.');
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="dashboard">
      <section className="dashboard-header">
        <div>
          <h1>{user?.name ? `${user.name}'s Tasks` : 'My Tasks'}</h1>
          <p className="subtitle">Stay organized and track your daily progress.</p>
        </div>

        <div className="stats-row">
          <div className="stat-box">
            <span className="stat-value">{tasks.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{pendingCount}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{completedCount}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </section>

      <Alert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: '', message: '' })}
      />

      <TaskForm onCreateTask={handleCreateTask} isSubmitting={isCreating} />

      <section className="card task-list-card">
        <h2 className="section-title">Your Tasks</h2>

        {isLoading ? (
          <p className="empty-state">Loading your tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="empty-state">No tasks yet. Add your first task above!</p>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;

