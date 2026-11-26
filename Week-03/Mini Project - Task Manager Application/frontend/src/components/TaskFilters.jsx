import { RotateCcw, Search } from "lucide-react";

const TaskFilters = ({ filters, onChange, onReset }) => {
  const hasActiveFilters =
    filters.search ||
    filters.status !== "All" ||
    filters.priority !== "All" ||
    filters.dueDate;

  return (
    <section className="filters-bar" aria-label="Filter tasks">
      <div className="search-field">
        <Search size={17} className="search-icon" />
        <input
          type="text"
          placeholder="Search tasks by title..."
          value={filters.search}
          onChange={(e) => onChange("search", e.target.value)}
          aria-label="Search tasks by title"
        />
      </div>

      <div className="filter-controls">
        <select
          value={filters.status}
          onChange={(e) => onChange("status", e.target.value)}
          aria-label="Filter by status"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => onChange("priority", e.target.value)}
          aria-label="Filter by priority"
        >
          <option value="All">All Priorities</option>
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>

        <input
          type="date"
          value={filters.dueDate}
          onChange={(e) => onChange("dueDate", e.target.value)}
          aria-label="Filter by due date"
          title="Filter by due date"
        />

        <button
          type="button"
          className="btn btn-outline"
          onClick={onReset}
          disabled={!hasActiveFilters}
          title="Clear filters and view all tasks"
        >
          <RotateCcw size={15} />
          <span>View All</span>
        </button>
      </div>
    </section>
  );
};

export default TaskFilters;

