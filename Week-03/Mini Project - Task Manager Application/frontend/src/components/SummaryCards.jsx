import { CheckCircle2, Clock, ListChecks, Loader2 } from "lucide-react";

const SummaryCards = ({ summary }) => {
  const cards = [
    {
      label: "Total Tasks",
      value: summary?.total ?? 0,
      icon: ListChecks,
      tone: "card-total",
    },
    {
      label: "Pending",
      value: summary?.pending ?? 0,
      icon: Clock,
      tone: "card-pending",
    },
    {
      label: "In Progress",
      value: summary?.inProgress ?? 0,
      icon: Loader2,
      tone: "card-progress",
    },
    {
      label: "Completed",
      value: summary?.completed ?? 0,
      icon: CheckCircle2,
      tone: "card-completed",
    },
  ];

  return (
    <section className="summary-grid" aria-label="Task summary">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className={`summary-card ${card.tone}`}>
            <div className="summary-card-text">
              <p className="summary-label">{card.label}</p>
              <p className="summary-value">{card.value}</p>
            </div>
            <div className="summary-icon">
              <Icon size={22} />
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default SummaryCards;

