import { useState } from 'react';

const TaskItem = ({ task, onToggleComplete, onUpdateTask, onDeleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editError, setEditError] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const handleToggle = async () => {
    setIsBusy(true);
    await onToggleComplete(task);
    setIsBusy(false);
  };

  const handleStartEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditError('');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditError('');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const trimmedTitle = editTitle.trim();
    const trimmedDescription = editDescription.trim();

    if (!trimmedTitle) {
      setEditError('Title cannot be empty.');
      return;
    }

    if (trimmedTitle.length > 100) {
      setEditError('Title cannot exceed 100 characters.');
      return;
    }

    if (trimmedDescription.length > 500) {
      setEditError('Description cannot exceed 500 characters.');
      return;
    }

    setIsBusy(true);
    const success = await onUpdateTask(task._id, {
      title: trimmedTitle,
      description: trimmedDescription,
    });
    setIsBusy(false);

    if (success) {
      setIsEditing(false);
      setEditError('');
    }
  };

  const handleDelete = async () => {
    setIsBusy(true);
    await onDeleteTask(task._id);
    setIsBusy(false);
  };

  return (
    <article className={`task-item ${task.completed ? 'task-completed' : ''}`}>
      {isEditing ? (
        <form onSubmit={handleSaveEdit} className="task-edit-form" noValidate>
          <div className="form-group">
            <label htmlFor={`edit-title-${task._id}`}>Task Title *</label>
            <input
              id={`edit-title-${task._id}`}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              maxLength={100}
              disabled={isBusy}
            />
          </div>
          <div className="form-group">
            <label htmlFor={`edit-desc-${task._id}`}>Description</label>
            <textarea
              id={`edit-desc-${task._id}`}
              rows={2}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              maxLength={500}
              disabled={isBusy}
            />
          </div>
          {editError && <p className="field-error">{editError}</p>}
          <div className="task-actions">
            <button type="submit" className="btn btn-primary btn-sm" disabled={isBusy}>
              {isBusy ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleCancelEdit}
              disabled={isBusy}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="task-row">
          <div className="task-main">
            <input
              type="checkbox"
              className="task-checkbox"
              checked={task.completed}
              onChange={handleToggle}
              disabled={isBusy}
              aria-label={`Mark "${task.title}" as ${task.completed ? 'pending' : 'completed'}`}
            />
            <div className="task-content">
              <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <span className={`status-badge ${task.completed ? 'badge-done' : 'badge-pending'}`}>
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
              {task.description && <p className="task-description">{task.description}</p>}
            </div>
          </div>

          <div className="task-actions">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleStartEdit}
              disabled={isBusy}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={handleDelete}
              disabled={isBusy}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </article>
  );
};

export default TaskItem;

