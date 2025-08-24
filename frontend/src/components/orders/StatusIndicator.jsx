import React from "react";

const StatusIndicator = ({ status, colorMap }) => {
  const color = colorMap[String(status).toUpperCase()] || "bg-gray-300";

  return (
    <div className="mt-2 flex items-center gap-2 text-xxs uppercase text-subtext">
      <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
      <span>{String(status).replace(/_/g, " ")}</span>
    </div>
  );
};

export default StatusIndicator;