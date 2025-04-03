import { useState } from 'react'
import Canvas from './components/Canvas'
import Toolbar from './components/Toolbar'

function App() {
  const [items, setItems] = useState([])
  const [selectedItemId, setSelectedItemId] = useState(null)

  const addItem = (type) => {
    const newItem = {
      id: Date.now(),
      type,
      x: Math.random() * 400 + 50,
      y: Math.random() * 400 + 50,
      width: type === 'text' ? 200 : 100,
      height: type === 'text' ? 50 : 100,
      content: type === 'text' ? 'Double click to edit' : null,
    }
    setItems([...items, newItem])
  }

  const deleteSelectedItem = () => {
    if (selectedItemId !== null) {
      setItems(items.filter(item => item.id !== selectedItemId))
      setSelectedItemId(null)
    }
  }

  const handleItemSelect = (itemId) => {
    setSelectedItemId(itemId === selectedItemId ? null : itemId)
  }

  const handleCanvasClick = (e) => {
    // Deselect if clicking on the canvas background
    if (e.target === e.currentTarget) {
      setSelectedItemId(null)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-bold text-gray-800">Canvas Editor</h1>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <Toolbar 
          onAddItem={addItem} 
          onDeleteItem={deleteSelectedItem}
          canDelete={selectedItemId !== null}
        />
        <main className="flex-1 p-4 overflow-auto">
          <Canvas 
            items={items}
            selectedItemId={selectedItemId}
            onItemSelect={handleItemSelect}
            onCanvasClick={handleCanvasClick}
            onDeleteItem={deleteSelectedItem}
          />
        </main>
      </div>
    </div>
  )
}

export default App