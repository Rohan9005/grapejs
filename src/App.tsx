import './App.css'
import TemplateEditor from './TemplateEditor';



function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={{ height: 600, width: '100%', border: '1px solid #ddd' }}>
        <TemplateEditor
          initialHbs="<div>{{title}}</div>"
          sampleData={{
            title: 'Hello',
            user: { name: 'Rohan', isActive: true },
            orders: [
              { id: 1, product: 'Laptop' },
              { id: 2, product: 'Mouse' },
            ],
          }}
          dataSources={{
            title: 'Hello',
            user: { name: 'Rohan', isActive: true },
            orders: [
              { id: 1, product: 'Laptop' },
              { id: 2, product: 'Mouse' },
            ],
          }}
          onExport={(hbs) => console.log('Exported HBS:', hbs)}
        />

      </div>
    </div>
  )
}

export default App
