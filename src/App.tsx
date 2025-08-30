import './App.css'
import { handlebarCode, handlebarJSON } from './const';
import TemplateEditor from './TemplateEditor';



function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={{ height: 600, width: '100%', border: '1px solid #ddd' }}>
        <TemplateEditor
          initialHbs={handlebarCode}
          sampleData={handlebarJSON}
          dataSources={handlebarJSON}
          onExport={(hbs) => console.log('Exported HBS:', hbs)}
        />

      </div>
    </div>
  )
}

export default App
