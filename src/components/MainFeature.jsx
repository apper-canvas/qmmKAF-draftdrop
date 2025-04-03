import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Image, 
  Type, 
  AlignLeft, 
  Table, 
  FileText, 
  Trash2, 
  Plus, 
  Download, 
  Copy, 
  Settings, 
  Edit3, 
  Layers
} from 'lucide-react'

const MainFeature = () => {
  // State for invoice data
  const [invoiceData, setInvoiceData] = useState({
    title: "Invoice #INV-001",
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    companyName: "Your Company Name",
    companyAddress: "123 Business St, City, Country",
    clientName: "Client Name",
    clientAddress: "456 Client Ave, City, Country",
    items: [
      { id: 1, description: "Web Design Services", quantity: 1, price: 1200, amount: 1200 },
      { id: 2, description: "Hosting (Annual)", quantity: 1, price: 200, amount: 200 }
    ],
    notes: "Thank you for your business!",
    terms: "Payment due within 30 days."
  })

  // State for canvas elements
  const [elements, setElements] = useState([
    { id: 'header', type: 'header', content: 'INVOICE', position: { top: '20px', left: '0' }, width: '100%' },
    { id: 'logo', type: 'image', src: 'https://source.unsplash.com/random/100x100?logo', position: { top: '70px', right: '40px' }, width: '100px', height: '100px' },
    { id: 'footer', type: 'footer', content: 'Thank you for your business', position: { bottom: '20px', left: '0' }, width: '100%' }
  ])

  // State for currently selected element
  const [selectedElement, setSelectedElement] = useState(null)
  
  // State for drag operation
  const [isDragging, setIsDragging] = useState(false)
  const [draggedElement, setDraggedElement] = useState(null)
  
  // Refs
  const canvasRef = useRef(null)
  const dragSourceRef = useRef(null)
  
  // Calculate total
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0)
  const taxRate = 0.1 // 10%
  const taxAmount = subtotal * taxRate
  const total = subtotal + taxAmount

  // Handle starting drag
  const handleDragStart = (e, elementType) => {
    setIsDragging(true)
    setDraggedElement(elementType)
    dragSourceRef.current = { x: e.clientX, y: e.clientY }
    
    // Set ghost image (optional)
    const ghostElement = document.createElement('div')
    ghostElement.classList.add('element-placeholder')
    ghostElement.textContent = elementType
    ghostElement.style.width = '100px'
    ghostElement.style.height = '50px'
    document.body.appendChild(ghostElement)
    e.dataTransfer.setDragImage(ghostElement, 50, 25)
    setTimeout(() => {
      document.body.removeChild(ghostElement)
    }, 0)
    
    e.dataTransfer.setData('text/plain', elementType)
  }
  
  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.classList.add('active')
  }
  
  // Handle drag leave
  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('active')
  }
  
  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove('active')
    
    if (!isDragging || !draggedElement) return
    
    const canvas = canvasRef.current
    const canvasRect = canvas.getBoundingClientRect()
    
    // Calculate position relative to canvas
    const x = e.clientX - canvasRect.left
    const y = e.clientY - canvasRect.top
    
    // Create new element
    const newElement = {
      id: `${draggedElement}-${Date.now()}`,
      type: draggedElement,
      position: {
        top: `${y}px`,
        left: `${x}px`
      },
      width: draggedElement === 'header' || draggedElement === 'footer' ? '100%' : '150px',
      height: draggedElement === 'image' ? '150px' : 'auto'
    }
    
    // Add content based on type
    if (draggedElement === 'header') {
      newElement.content = 'INVOICE'
    } else if (draggedElement === 'footer') {
      newElement.content = 'Thank you for your business'
    } else if (draggedElement === 'image') {
      newElement.src = 'https://source.unsplash.com/random/150x150?logo'
    }
    
    setElements([...elements, newElement])
    setIsDragging(false)
    setDraggedElement(null)
  }
  
  // Handle element selection
  const handleElementClick = (e, element) => {
    e.stopPropagation()
    setSelectedElement(element.id)
  }
  
  // Handle canvas click (deselect)
  const handleCanvasClick = () => {
    setSelectedElement(null)
  }
  
  // Handle element deletion
  const handleDeleteElement = (id) => {
    setElements(elements.filter(el => el.id !== id))
    setSelectedElement(null)
  }
  
  // Handle item change
  const handleItemChange = (id, field, value) => {
    setInvoiceData(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          
          // Recalculate amount if quantity or price changes
          if (field === 'quantity' || field === 'price') {
            updatedItem.quantity = field === 'quantity' ? parseFloat(value) : item.quantity
            updatedItem.price = field === 'price' ? parseFloat(value) : item.price
            updatedItem.amount = updatedItem.quantity * updatedItem.price
          }
          
          return updatedItem
        }
        return item
      })
      
      return { ...prev, items: updatedItems }
    })
  }
  
  // Add new item
  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      description: "New Item",
      quantity: 1,
      price: 0,
      amount: 0
    }
    
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }))
  }
  
  // Remove item
  const handleRemoveItem = (id) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }))
  }
  
  // Handle invoice data change
  const handleInvoiceDataChange = (field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Sidebar - Elements */}
      <div className="lg:col-span-2">
        <div className="card p-4 sticky top-24">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Layers size={18} />
            <span>Elements</span>
          </h3>
          
          <div className="space-y-3">
            <div 
              draggable
              onDragStart={(e) => handleDragStart(e, 'header')}
              className="p-3 bg-surface-100 dark:bg-surface-700 rounded-lg flex items-center gap-3 cursor-grab active:cursor-grabbing hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            >
              <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
                <AlignLeft size={16} className="text-primary" />
              </div>
              <span>Header</span>
            </div>
            
            <div 
              draggable
              onDragStart={(e) => handleDragStart(e, 'image')}
              className="p-3 bg-surface-100 dark:bg-surface-700 rounded-lg flex items-center gap-3 cursor-grab active:cursor-grabbing hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            >
              <div className="w-8 h-8 rounded-md bg-secondary/20 flex items-center justify-center">
                <Image size={16} className="text-secondary" />
              </div>
              <span>Image</span>
            </div>
            
            <div 
              draggable
              onDragStart={(e) => handleDragStart(e, 'footer')}
              className="p-3 bg-surface-100 dark:bg-surface-700 rounded-lg flex items-center gap-3 cursor-grab active:cursor-grabbing hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            >
              <div className="w-8 h-8 rounded-md bg-accent/20 flex items-center justify-center">
                <Type size={16} className="text-accent" />
              </div>
              <span>Footer</span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Settings size={18} />
              <span>Actions</span>
            </h3>
            
            <div className="space-y-2">
              <button className="w-full btn btn-outline flex items-center justify-center gap-2 text-sm">
                <Copy size={16} />
                <span>Duplicate</span>
              </button>
              
              <button className="w-full btn btn-primary flex items-center justify-center gap-2 text-sm">
                <Download size={16} />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Center - Canvas */}
      <div className="lg:col-span-6">
        <div className="card p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText size={18} />
              <span>Invoice Canvas</span>
            </h3>
            
            <div className="flex gap-2">
              <button className="p-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700">
                <Edit3 size={18} />
              </button>
            </div>
          </div>
          
          <div 
            ref={canvasRef}
            className="invoice-canvas drop-zone relative overflow-hidden p-8 border border-surface-300 dark:border-surface-600"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleCanvasClick}
          >
            {/* Invoice Content */}
            <div className="text-surface-800 dark:text-surface-800">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">{invoiceData.title}</h1>
              </div>
              
              <div className="flex justify-between mb-8">
                <div>
                  <h2 className="font-bold mb-2">From:</h2>
                  <p>{invoiceData.companyName}</p>
                  <p>{invoiceData.companyAddress}</p>
                </div>
                
                <div className="text-right">
                  <h2 className="font-bold mb-2">To:</h2>
                  <p>{invoiceData.clientName}</p>
                  <p>{invoiceData.clientAddress}</p>
                </div>
              </div>
              
              <div className="flex justify-between mb-8">
                <div>
                  <p><strong>Date:</strong> {invoiceData.date}</p>
                </div>
                
                <div>
                  <p><strong>Due Date:</strong> {invoiceData.dueDate}</p>
                </div>
              </div>
              
              <table className="w-full mb-8 border-collapse">
                <thead>
                  <tr className="bg-surface-200">
                    <th className="border border-surface-300 p-2 text-left">Description</th>
                    <th className="border border-surface-300 p-2 text-right">Qty</th>
                    <th className="border border-surface-300 p-2 text-right">Price</th>
                    <th className="border border-surface-300 p-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map(item => (
                    <tr key={item.id}>
                      <td className="border border-surface-300 p-2">{item.description}</td>
                      <td className="border border-surface-300 p-2 text-right">{item.quantity}</td>
                      <td className="border border-surface-300 p-2 text-right">${item.price.toFixed(2)}</td>
                      <td className="border border-surface-300 p-2 text-right">${item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="border border-surface-300 p-2 text-right font-bold">Subtotal:</td>
                    <td className="border border-surface-300 p-2 text-right">${subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="border border-surface-300 p-2 text-right font-bold">Tax (10%):</td>
                    <td className="border border-surface-300 p-2 text-right">${taxAmount.toFixed(2)}</td>
                  </tr>
                  <tr className="bg-surface-100">
                    <td colSpan="3" className="border border-surface-300 p-2 text-right font-bold">Total:</td>
                    <td className="border border-surface-300 p-2 text-right font-bold">${total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
              
              <div className="mb-8">
                <h3 className="font-bold mb-2">Notes:</h3>
                <p>{invoiceData.notes}</p>
              </div>
              
              <div>
                <h3 className="font-bold mb-2">Terms:</h3>
                <p>{invoiceData.terms}</p>
              </div>
            </div>
            
            {/* Draggable Elements */}
            {elements.map(element => (
              <div
                key={element.id}
                className={`absolute ${selectedElement === element.id ? 'ring-2 ring-primary' : ''}`}
                style={{
                  top: element.position.top,
                  left: element.position.left,
                  right: element.position.right,
                  bottom: element.position.bottom,
                  width: element.width,
                  height: element.height,
                  cursor: 'move'
                }}
                onClick={(e) => handleElementClick(e, element)}
              >
                {element.type === 'header' && (
                  <div className="text-center font-bold text-2xl p-2">
                    {element.content}
                  </div>
                )}
                
                {element.type === 'footer' && (
                  <div className="text-center text-sm p-2">
                    {element.content}
                  </div>
                )}
                
                {element.type === 'image' && (
                  <img 
                    src={element.src} 
                    alt="Draggable element" 
                    className="w-full h-full object-contain"
                  />
                )}
                
                {selectedElement === element.id && (
                  <div className="absolute -top-10 right-0 bg-white dark:bg-surface-800 shadow-md rounded-md p-1 flex gap-1">
                    <button 
                      onClick={() => handleDeleteElement(element.id)}
                      className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded"
                    >
                      <Trash2 size={16} className="text-accent" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right Sidebar - Properties */}
      <div className="lg:col-span-4">
        <div className="card p-4 sticky top-24">
          <h3 className="font-semibold mb-4">Invoice Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Invoice Title</label>
              <input 
                type="text" 
                className="input-field"
                value={invoiceData.title}
                onChange={(e) => handleInvoiceDataChange('title', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input 
                  type="date" 
                  className="input-field"
                  value={invoiceData.date}
                  onChange={(e) => handleInvoiceDataChange('date', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input 
                  type="date" 
                  className="input-field"
                  value={invoiceData.dueDate}
                  onChange={(e) => handleInvoiceDataChange('dueDate', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Your Company</label>
              <input 
                type="text" 
                className="input-field"
                value={invoiceData.companyName}
                onChange={(e) => handleInvoiceDataChange('companyName', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Your Address</label>
              <textarea 
                className="input-field"
                rows="2"
                value={invoiceData.companyAddress}
                onChange={(e) => handleInvoiceDataChange('companyAddress', e.target.value)}
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Client Name</label>
              <input 
                type="text" 
                className="input-field"
                value={invoiceData.clientName}
                onChange={(e) => handleInvoiceDataChange('clientName', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Client Address</label>
              <textarea 
                className="input-field"
                rows="2"
                value={invoiceData.clientAddress}
                onChange={(e) => handleInvoiceDataChange('clientAddress', e.target.value)}
              ></textarea>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Line Items</label>
                <button 
                  onClick={handleAddItem}
                  className="p-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-hide">
                {invoiceData.items.map((item, index) => (
                  <div key={item.id} className="p-3 bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Item #{index + 1}</span>
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        className="input-field text-sm"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      />
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <input 
                            type="number" 
                            className="input-field text-sm"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <input 
                            type="number" 
                            className="input-field text-sm"
                            placeholder="Price"
                            value={item.price}
                            onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <input 
                            type="text" 
                            className="input-field text-sm bg-surface-100 dark:bg-surface-700"
                            placeholder="Amount"
                            value={`$${item.amount.toFixed(2)}`}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea 
                className="input-field"
                rows="2"
                value={invoiceData.notes}
                onChange={(e) => handleInvoiceDataChange('notes', e.target.value)}
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Terms</label>
              <textarea 
                className="input-field"
                rows="2"
                value={invoiceData.terms}
                onChange={(e) => handleInvoiceDataChange('terms', e.target.value)}
              ></textarea>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
            <div className="flex justify-between text-sm mb-1">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm mb-1">
              <span>Tax (10%):</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainFeature