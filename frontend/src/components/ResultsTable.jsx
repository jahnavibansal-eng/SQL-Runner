import React from "react";

export default function ResultsTable({ rows = [] }) {
  if (!Array.isArray(rows)) return null;

  if (rows.length === 0) {
    return <div className="muted">No results</div>;
  }

  const columns = Object.keys(rows[0]);

  return (
    <div className="results-table-wrap">
      <table className="results-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col + idx}>{String(row[col] ?? "")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
