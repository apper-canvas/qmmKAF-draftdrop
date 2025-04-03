import { useState } from 'react'
import { Square, Circle, Type } from 'lucide-react'

const CanvasItem = ({ item, isSelected, onSelect }) => {
  const [content, setContent] = useState(item.content)
  const [isEditing, setIsEditing] = useState(false)

  const handleDoubleClick = () => {
    if (item.type === 'text') {
      setIsEditing(true)
    }
  }

  const handleContentChange = (e) => {
    setContent(e.target.value)
  }

  const handleBlur = () => {
    setIsEditing(false)
  }

  const getItemStyles = () => {
    const baseStyles = `absolute cursor-pointer transition-all duration-150 
                        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`;
    
    switch (item.type) {
      case 'rectangle':
        return `${baseStyles} bg-blue-200 border border-blue-400`;
      case 'circle':
        return `${baseStyles} bg-green-200 border border-green-400 rounded-full`;
      case 'text':
        return `${baseStyles} bg-yellow-50 border border-yellow-200 p-2`;
      default:
        return baseStyles;
    }
  }

  const renderItemContent = () => {
    switch (item.type) {
      case 'rectangle':
        return <Square className="w-6 h-6 text-blue-500 m-auto" />;
      case 'circle':
        return <Circle className="w-6 h-6 text-green-500 m-auto" />;
      case 'text':
        if (isEditing) {
          return (
            <textarea
              className="w-full h-full bg-transparent text-gray-800 outline-none resize-none"
              value={content}
              onChange={handleContentChange}
              onBlur={handleBlur}
              autoFocus
            />
          );
        }
        return <p className="text-gray-800">{content}</p>;
      default:
        return null;
    }
  }

  return (
    <div
      className={getItemStyles()}
      style={{
        left: `${item.x}px`,
        top: `${item.y}px`,
        width: `${item.width}px`,
        height: `${item.height}px`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={handleDoubleClick}
    >
      <div className="flex items-center justify-center h-full">
        {renderItemContent()}
      </div>
    </div>
  )
}

export default CanvasItem