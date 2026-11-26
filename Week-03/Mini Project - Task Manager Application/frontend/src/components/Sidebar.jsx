import {
  CheckCircle2,
  Clock,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Plus,
  Sparkles,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "All Tasks", value: "All", icon: LayoutDashboard },
  { label: "Pending", value: "Pending", icon: Clock },
  { label: "In Progress", value: "In Progress", icon: Sparkles },
  { label: "Completed", value: "Completed", icon: CheckCircle2 },
];

const Sidebar = ({
  user,
  activeStatus,
  onSelectStatus,
  onOpenAddModal,
  onLogout,
  isOpen,
  onClose,
}) => {
  const handleStatusClick = (statusValue) => {
    onSelectStatus(statusValue);
    onClose();
  };

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-top">
          <div className="brand">
            <div className="brand-icon">
              <ListTodo size={22} />
            </div>
            <div>
              <h1 className="brand-title">TaskFlow</h1>
              <span className="brand-subtitle">Task Manager</span>
            </div>
            <button
              type="button"
              className="sidebar-close-btn"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-full sidebar-add-btn"
            onClick={() => {
              onOpenAddModal();
              onClose();
            }}
          >
            <Plus size={18} />
            <span>Add Task</span>
          </button>

          <nav className="sidebar-nav" aria-label="Task status navigation">
            <p className="nav-section-label">Workspace</p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeStatus === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  className={`nav-item ${isActive ? "nav-item-active" : ""}`}
                  onClick={() => handleStatusClick(item.value)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="user-meta">
              <p className="user-name">{user?.name || "User"}</p>
              <p className="user-email">{user?.email || ""}</p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline btn-full logout-btn"
            onClick={onLogout}
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

