import { Square, Circle, Type, Trash2 } from 'lucide-react'

const Toolbar = ({ onAddItem, onDeleteItem, canDelete }) => {
  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4">
      <ToolButton 
        icon={<Square className="w-6 h-6" />} 
        tooltip="Add Rectangle" 
        onClick={() => onAddItem('rectangle')}
      />
      <ToolButton 
        icon={<Circle className="w-6 h-6" />} 
        tooltip="Add Circle" 
        onClick={() => onAddItem('circle')}
      />
      <ToolButton 
        icon={<Type className="w-6 h-6" />} 
        tooltip="Add Text" 
        onClick={() => onAddItem('text')}
      />
      
      <div className="border-t border-gray-200 w-10 my-4"></div>
      
      <ToolButton 
        icon={<Trash2 className={`w-6 h-6 ${canDelete ? 'text-red-500' : 'text-gray-300'}`} />} 
        tooltip="Delete Selected (or press Delete key)" 
        onClick={onDeleteItem}
        disabled={!canDelete}
      />
    </div>
  )
}

const ToolButton = ({ icon, tooltip, onClick, disabled = false }) => (
  <button
    className={`w-10 h-10 mb-2 flex items-center justify-center rounded hover:bg-gray-100 relative group ${
      disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
    }`}
    onClick={disabled ? undefined : onClick}
    title={tooltip}
  >
    {icon}
    <span className="absolute left-12 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      {tooltip}
    </span>
  </button>
)

export default Toolbar