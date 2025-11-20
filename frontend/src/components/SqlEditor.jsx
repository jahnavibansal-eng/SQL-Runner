import React, { useState } from 'react'


export default function SqlEditor({ onRun, loading }) {
const [sql, setSql] = useState('SELECT * FROM Customers LIMIT 10;')


function run() {
if (!sql.trim()) return
onRun(sql)
}


return (
<div className="sql-editor">
<label htmlFor="sql">SQL Query</label>
<textarea
id="sql"
rows={8}
value={sql}
onChange={(e) => setSql(e.target.value)}
/>
<div className="editor-actions">
<button className="btn" onClick={run} disabled={loading}>
Run Query
</button>
</div>
</div>
)
}