import React, { useEffect, useState } from "react";
import Login from "./Login";
import Sidebar from "./components/Sidebar";
import SqlEditor from "./components/SqlEditor";
import ResultsTable from "./components/ResultsTable";
import TablePreview from "./components/TablePreview";
import { fetchTables, fetchTableInfo, runQuery } from "./api";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableInfo, setTableInfo] = useState(null);
  const [queryResult, setQueryResult] = useState(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState(null);


  useEffect(() => {
    if (loggedIn) {
      loadTables();
    }
  }, [loggedIn]);

  async function loadTables() {
    try {
      const t = await fetchTables();
      setTables(t);
    } catch (err) {
      console.error("Failed to load tables:", err);
    }
  }

  async function onSelectTable(name) {
    setSelectedTable(name);
    setTableInfo(null);

    try {
      const info = await fetchTableInfo(name);
      setTableInfo(info);
    } catch (err) {
      setTableInfo({ error: err.message || "Failed to fetch table info." });
    }
  }

  async function onRunQuery(sql) {
    if (!sql.trim()) {
      setQueryError("Query cannot be empty.");
      return;
    }

    setQueryLoading(true);
    setQueryError(null);
    setQueryResult(null);

    try {
      const res = await runQuery(sql);

      if (res.error) {
        setQueryError(res.error);
      } else if (Array.isArray(res.results)) {
        setQueryResult(res.results);
      } else {
        setQueryError("Unexpected response format.");
      }
    } catch (err) {
      setQueryError(err.message || "Query failed.");
    } finally {
      setQueryLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
  }

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="app-root">
      <Sidebar
        tables={tables}
        selected={selectedTable}
        onSelect={onSelectTable}
        onRefresh={loadTables}
        onRunQuery={onRunQuery}
        logout={logout}
      />

      <main className="main-area">
        <header className="main-header">
          <h1>SQL Runner</h1>
        </header>

        <section className="workspace">
          <div className="left-panel">
            <SqlEditor onRun={onRunQuery} loading={queryLoading} />

            <div className="results-area">
              <h3>Query Results</h3>

              {queryLoading && <div className="muted">Running query...</div>}
              {queryError && <div className="error">{queryError}</div>}
              {queryResult?.length > 0 ? (
                <ResultsTable rows={queryResult} />
              ) : (
                !queryLoading &&
                !queryError && (
                  <div className="muted">No results to display.</div>
                )
              )}
            </div>
          </div>

          <aside className="right-panel">
            <h3>Table Preview</h3>
            {selectedTable ? (
              tableInfo?.error ? (
                <div className="error">{tableInfo.error}</div>
              ) : (
                <TablePreview info={tableInfo} />
              )
            ) : (
              <div className="muted">Select a table to preview schema.</div>
            )}
          </aside>
        </section>
      </main>
    </div>
  );
}
