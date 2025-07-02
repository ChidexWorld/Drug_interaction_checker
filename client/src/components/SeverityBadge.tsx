import React from "react";
import type { SeverityBadgeProps } from "../types";

const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  type,
  className = "",
}) => {
  const getBadgeClasses = () => {
    switch (severity) {
      case 4:
        return "severity-contraindicated";
      case 3:
        return "severity-major";
      case 2:
        return "severity-moderate";
      case 1:
        return "severity-minor";
      default:
        return "severity-minor";
    }
  };

  return <span className={`${getBadgeClasses()} ${className}`}>{type}</span>;
};

export default SeverityBadge;
