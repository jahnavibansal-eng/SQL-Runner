import React from 'react'

export default function TablePreview({ info }) {
if (!info) return <div className="muted">Loading...</div>
if (info.error) return <div className="error">{info.error}</div>


return (
<div className="table-preview">
<h4>Schema</h4>
<table className="schema-table">
<thead>
<tr>
<th>Column</th>
<th>Type</th>
</tr>
</thead>
<tbody>
{info.columns && info.columns.map((c) => (
<tr key={c.name}>
<td>{c.name}</td>
<td>{c.type}</td>
</tr>
))}
</tbody>
</table>

<h4>Sample Rows</h4>
{info.sample_data && info.sample_data.length > 0 ? (
<div className="sample-rows">
<table>
<thead>
<tr>
{Object.keys(info.sample_data[0]).map((col) => (
<th key={col}>{col}</th>
))}
</tr>
</thead>
<tbody>
{info.sample_data.map((row, i) => (
<tr key={i}>
{Object.keys(row).map((col) => (
<td key={col + i}>{String(row[col])}</td>
))}
</tr>
))}
</tbody>
</table>
</div>
) : (
<div className="muted">No sample rows</div>
)}
</div>
)
}