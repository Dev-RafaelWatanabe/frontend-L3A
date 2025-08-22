const estilosDashboard = {
  container: {
    maxWidth: 900,
    margin: '32px auto',
    padding: 24,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 12px #0002'
  } as React.CSSProperties,
  select: {
    padding: '6px 12px',
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: 16,
    marginLeft: 8
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: 16,
    fontSize: 15
  } as React.CSSProperties,
  th: {
    background: '#1976d2',
    color: '#fff',
    padding: '10px 8px',
    textAlign: 'left',
    fontWeight: 600
  } as React.CSSProperties,
  trGrupo: {
    background: '#e3f2fd',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'background 0.2s'
  } as React.CSSProperties,
  td: {
    padding: '8px 8px',
    borderBottom: '1px solid #eee'
  } as React.CSSProperties,
  detalhe: {
    background: '#f9f9f9',
    borderRadius: 6,
    padding: '6px 10px',
    marginBottom: 4,
    boxShadow: '0 1px 4px #0001'
  } as React.CSSProperties
};

export default estilosDashboard;