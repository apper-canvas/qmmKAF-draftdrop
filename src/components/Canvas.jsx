import { useEffect } from 'react'
import CanvasItem from './CanvasItem'
import useKeyPress from '../hooks/useKeyPress'

const Canvas = ({ items, selectedItemId, onItemSelect, onCanvasClick, onDeleteItem }) => {
  const deleteKeyPressed = useKeyPress('Delete')

  useEffect(() => {
    if (deleteKeyPressed && selectedItemId !== null) {
      onDeleteItem()
    }
  }, [deleteKeyPressed, selectedItemId, onDeleteItem])

  return (
    <div 
      className="w-full h-full bg-white border border-gray-300 rounded-lg shadow-inner overflow-hidden relative"
      onClick={onCanvasClick}
    >
      {items.map(item => (
        <CanvasItem
          key={item.id}
          item={item}
          isSelected={item.id === selectedItemId}
          onSelect={() => onItemSelect(item.id)}
        />
      ))}
      {items.length === 0 && (
        <div className="flex h-full items-center justify-center text-gray-400">
          <p>Add an item using the toolbar on the left</p>
        </div>
      )}
    </div>
  )
}

export default Canvas