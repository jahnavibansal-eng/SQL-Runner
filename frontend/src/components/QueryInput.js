function QueryInput({ query, setQuery, onRun }) {
  return (
    <>
      <textarea value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={onRun}>Run Query</button>
    </>
  );
}
