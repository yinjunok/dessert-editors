import React from 'react'
import ReactDOM from 'react-dom/client'
import SlateEditor from './index'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <main
      className='p-6 rounded shadow transition-all'
      style={{
        width: 800,
        margin: '50px auto'
      }}
    >
      <SlateEditor />
    </main>
  </React.StrictMode>,
)
