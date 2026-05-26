import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-500 py-4">
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link to={item.href} className="hover:text-gray-900 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-gray-900 font-medium" : ""}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="w-4 h-4 text-gray-400" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
