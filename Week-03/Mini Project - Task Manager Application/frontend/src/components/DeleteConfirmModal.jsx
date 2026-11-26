import { AlertTriangle, X } from "lucide-react";

const DeleteConfirmModal = ({ task, onCancel, onConfirm, deleting }) => {
  if (!task) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card modal-card-sm">
        <div className="modal-header">
          <div className="delete-modal-title">
            <AlertTriangle size={20} className="text-danger" />
            <h2>Delete Task</h2>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={onCancel}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <p className="delete-modal-body">
          Are you sure you want to delete{" "}
          <strong>&ldquo;{task.title}&rdquo;</strong>? This action cannot be
          undone.
        </p>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onCancel}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;

