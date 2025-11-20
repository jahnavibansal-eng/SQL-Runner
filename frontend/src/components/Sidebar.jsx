import React, { useEffect, useState } from "react";
import { fetchHistory, clearHistoryAPI } from "../api";

export default function Sidebar({
  tables = [],
  selected,
  onSelect,
  onRefresh,
  onRunQuery,
  logout,
}) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const h = await fetchHistory();
      setHistory(h);
    } catch (err) {
      console.error("History error", err);
    }
  }

  async function clearHistory() {
    try {
      await clearHistoryAPI();
      setHistory([]); 
    } catch (err) {
      console.error("Failed to clear history", err);
    }
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Tables</h3>

        <button
          className="btn small"
          onClick={() => {
            console.log("Refresh clicked");
            onRefresh();
          }}
        >
          Refresh
        </button>
      </div>

      <ul className="table-list">
        {tables.map((t) => (
          <li
            key={t}
            className={t === selected ? "selected" : ""}
            onClick={() => onSelect(t)}
          >
            {t}
          </li>
        ))}
      </ul>

      <hr style={{ margin: "16px 0" }} />

      <div className="history-header">
        <h3 style={{ display: "inline-block" }}>Recent Queries</h3>

        <button className="btn small danger" onClick={clearHistory}>
          Clear
        </button>
      </div>

      <div className="history-container">
        <ul className="table-list">
          {history.length === 0 && (
            <li className="muted">No recent queries</li>
          )}

          {history.map((h, i) => (
            <li key={i} onClick={() => onRunQuery(h.query)}>
              {h.query.substring(0, 40)}…
            </li>
          ))}
        </ul>
      </div>

      <hr style={{ margin: "16px 0" }} />

      <button className="btn" onClick={logout} style={{ width: "100%" }}>
        Logout
      </button>
    </div>
  );
}
