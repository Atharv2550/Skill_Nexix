import { useState } from 'react';

const TaskForm = ({ onCreateTask, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setValidationError('Please enter a task title.');
      return;
    }

    if (trimmedTitle.length > 100) {
      setValidationError('Task title cannot exceed 100 characters.');
      return;
    }

    if (trimmedDescription.length > 500) {
      setValidationError('Description cannot exceed 500 characters.');
      return;
    }

    setValidationError('');
    const success = await onCreateTask({
      title: trimmedTitle,
      description: trimmedDescription,
    });

    if (success) {
      setTitle('');
      setDescription('');
    }
  };

  return (
    <section className="card task-form-card">
      <h2 className="section-title">Add New Task</h2>
      <form onSubmit={handleSubmit} noValidate className="task-form">
        <div className="form-group">
          <label htmlFor="task-title">Title *</label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Finish Week 3 React assignment"
            maxLength={100}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-description">Description (optional)</label>
          <textarea
            id="task-description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a brief note or details..."
            maxLength={500}
            disabled={isSubmitting}
          />
        </div>

        {validationError && <p className="field-error">{validationError}</p>}

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Adding Task...' : 'Add Task'}
        </button>
      </form>
    </section>
  );
};

export default TaskForm;

