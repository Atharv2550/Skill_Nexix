import { AlertCircle, CheckCircle2, X } from "lucide-react";

const AlertBanner = ({ type = "success", message, onClose }) => {
  if (!message) return null;

  const isError = type === "error";

  return (
    <div
      className={`alert-banner ${isError ? "alert-error" : "alert-success"}`}
      role="alert"
    >
      <div className="alert-content">
        {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          className="alert-close"
          onClick={onClose}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default AlertBanner;

