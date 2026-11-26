import { Calendar, Check, Edit2, RotateCcw, Trash2 } from "lucide-react";

const STATUS_CLASS = {
  Pending: "badge-status-pending",
  "In Progress": "badge-status-progress",
  Completed: "badge-status-completed",
};

const PRIORITY_CLASS = {
  Low: "badge-priority-low",
  Medium: "badge-priority-medium",
  High: "badge-priority-high",
};

const formatDate = (dateValue) => {
  if (!dateValue) return "No due date";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "No due date";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
};

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const isCompleted = task.status === "Completed";

  return (
    <article className={`task-card ${isCompleted ? "task-card-completed" : ""}`}>
      <div className="task-card-header">
        <div className="task-badges">
          <span className={`badge ${STATUS_CLASS[task.status] || ""}`}>
            {task.status}
          </span>
          <span className={`badge ${PRIORITY_CLASS[task.priority] || ""}`}>
            {task.priority}
          </span>
        </div>

        <span className="task-date">
          <Calendar size={14} />
          <span>{formatDate(task.dueDate)}</span>
        </span>
      </div>

      <h3 className="task-title">{task.title}</h3>

      <p className="task-description">
        {task.description ? task.description : "No description provided."}
      </p>

      <div className="task-card-actions">
        <button
          type="button"
          className={`btn btn-sm ${
            isCompleted ? "btn-outline" : "btn-success"
          }`}
          onClick={() => onToggleComplete(task)}
        >
          {isCompleted ? <RotateCcw size={14} /> : <Check size={14} />}
          <span>{isCompleted ? "Reopen" : "Complete"}</span>
        </button>

        <div className="task-icon-actions">
          <button
            type="button"
            className="btn-icon"
            onClick={() => onEdit(task)}
            title="Edit task"
            aria-label={`Edit ${task.title}`}
          >
            <Edit2 size={15} />
          </button>
          <button
            type="button"
            className="btn-icon btn-icon-danger"
            onClick={() => onDelete(task)}
            title="Delete task"
            aria-label={`Delete ${task.title}`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;

