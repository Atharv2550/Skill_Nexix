import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ClipboardList, Menu, Plus } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import SummaryCards from "../components/SummaryCards";
import TaskFilters from "../components/TaskFilters";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import AlertBanner from "../components/AlertBanner";

const DEFAULT_FILTERS = {
  search: "",
  status: "All",
  priority: "All",
  dueDate: "",
};

const DEFAULT_SUMMARY = {
  total: 0,
  pending: 0,
  inProgress: 0,
  completed: 0,
};

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [loadingTasks, setLoadingTasks] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [taskModal, setTaskModal] = useState({
    isOpen: false,
    mode: "add",
    task: null,
  });
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [alert, setAlert] = useState(() => location.state?.alert || null);

  // Clear router location state alert so refreshes do not replay it
  useEffect(() => {
    if (location.state?.alert) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Debounce search input to avoid excessive API requests while typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 250);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const fetchTasks = useCallback(async () => {
    try {
      setLoadingTasks(true);
      const params = {};
      if (filters.status !== "All") params.status = filters.status;
      if (filters.priority !== "All") params.priority = filters.priority;
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (filters.dueDate) params.dueDate = filters.dueDate;

      const response = await api.get("/tasks", { params });
      setTasks(response.data.tasks || []);
      setSummary(response.data.summary || DEFAULT_SUMMARY);
    } catch (err) {
      showAlert(
        "error",
        err.response?.data?.message || "Failed to load tasks."
      );
    } finally {
      setLoadingTasks(false);
    }
  }, [filters.status, filters.priority, filters.dueDate, debouncedSearch]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setDebouncedSearch("");
  };

  const openAddModal = () => {
    setTaskModal({ isOpen: true, mode: "add", task: null });
  };

  const openEditModal = (task) => {
    setTaskModal({ isOpen: true, mode: "edit", task });
  };

  const closeTaskModal = () => {
    setTaskModal({ isOpen: false, mode: "add", task: null });
  };

  const handleSaveTask = async (payload) => {
    try {
      setSubmitting(true);
      if (taskModal.mode === "edit" && taskModal.task) {
        await api.put(`/tasks/${taskModal.task._id}`, payload);
        showAlert("success", "Task updated successfully.");
      } else {
        await api.post("/tasks", payload);
        showAlert("success", "Task created successfully.");
      }
      closeTaskModal();
      await fetchTasks();
    } catch (err) {
      showAlert(
        "error",
        err.response?.data?.message || "Could not save task. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleComplete = async (task) => {
    const nextStatus = task.status === "Completed" ? "Pending" : "Completed";
    try {
      await api.put(`/tasks/${task._id}`, { status: nextStatus });
      showAlert(
        "success",
        nextStatus === "Completed"
          ? `Marked "${task.title}" as completed.`
          : `Reopened "${task.title}".`
      );
      await fetchTasks();
    } catch (err) {
      showAlert(
        "error",
        err.response?.data?.message || "Could not update task status."
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      setDeleting(true);
      await api.delete(`/tasks/${taskToDelete._id}`);
      showAlert("success", `Deleted "${taskToDelete.title}".`);
      setTaskToDelete(null);
      await fetchTasks();
    } catch (err) {
      showAlert(
        "error",
        err.response?.data?.message || "Could not delete task."
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        user={user}
        activeStatus={filters.status}
        onSelectStatus={(status) => handleFilterChange("status", status)}
        onOpenAddModal={openAddModal}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-left">
            <button
              type="button"
              className="btn-icon mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
            <div>
              <h2>Dashboard</h2>
              <p className="header-subtitle">
                Welcome back, {user?.name || "User"} — track and manage your
                tasks.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={openAddModal}
          >
            <Plus size={18} />
            <span>Add Task</span>
          </button>
        </header>

        {alert && (
          <AlertBanner
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <SummaryCards summary={summary} />

        <TaskFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        <section className="tasks-section" aria-label="Task list">
          <div className="tasks-section-header">
            <h3>
              {filters.status === "All"
                ? "All Tasks"
                : `${filters.status} Tasks`}
            </h3>
            <span className="task-count-pill">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"} shown
            </span>
          </div>

          {loadingTasks ? (
            <div className="tasks-loading">
              <div className="spinner" />
              <p>Loading your tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <ClipboardList size={42} />
              <h4>No tasks found</h4>
              <p>
                {summary.total === 0
                  ? "You haven't created any tasks yet. Click 'Add Task' to get started."
                  : "No tasks match your current filters. Try clearing or adjusting your filters."}
              </p>
              {summary.total === 0 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={openAddModal}
                >
                  <Plus size={18} />
                  <span>Create Your First Task</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleResetFilters}
                >
                  View All Tasks
                </button>
              )}
            </div>
          ) : (
            <div className="tasks-grid">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={openEditModal}
                  onDelete={(selected) => setTaskToDelete(selected)}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <TaskModal
        isOpen={taskModal.isOpen}
        mode={taskModal.mode}
        task={taskModal.task}
        onClose={closeTaskModal}
        onSubmit={handleSaveTask}
        submitting={submitting}
      />

      <DeleteConfirmModal
        task={taskToDelete}
        onCancel={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
      />
    </div>
  );
};

export default DashboardPage;

