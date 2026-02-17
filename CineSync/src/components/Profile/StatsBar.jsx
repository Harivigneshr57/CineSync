const stats = [
  { label: "Movies Watched", value: 10 },
  { label: "Watch Time", value: "486h" },
  { label: "Friends", value: "5" },
];

export default function StatsBar() {
  return (
    <div className="stats">
      {stats.map((stat) => (
        <div key={stat.label} className="stat">
          <p>{stat.value}</p>
          <span>{stat.label}</span>
        </div>
      ))}
    </div>
  );
}