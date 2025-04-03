import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Download, Send, Save, Info } from 'lucide-react'
import MainFeature from '../components/MainFeature'

const Home = () => {
  const [showTip, setShowTip] = useState(true)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-surface-800 dark:text-surface-100">
              Create Your Invoice
            </h1>
            <p className="text-surface-600 dark:text-surface-400 mt-1">
              Drag and drop elements to build a professional invoice
            </p>
          </div>
          
          <div className="flex gap-2">
            <motion.button 
              whileTap={{ scale: 0.97 }}
              className="btn btn-outline flex items-center gap-2"
            >
              <Save size={18} />
              <span>Save</span>
            </motion.button>
            
            <motion.button 
              whileTap={{ scale: 0.97 }}
              className="btn btn-primary flex items-center gap-2"
            >
              <Download size={18} />
              <span>Export</span>
            </motion.button>
          </div>
        </div>
        
        {/* Quick Tip */}
        <AnimatePresence>
          {showTip && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass rounded-xl p-4 flex items-start gap-3"
            >
              <div className="flex-shrink-0 bg-primary/10 dark:bg-primary/20 p-2 rounded-full">
                <Info size={20} className="text-primary" />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-surface-800 dark:text-surface-100">Quick Tip</h3>
                <p className="text-surface-600 dark:text-surface-400 text-sm mt-1">
                  Drag elements from the left sidebar and drop them onto your invoice canvas. Click on any element to edit its content directly.
                </p>
              </div>
              <button 
                onClick={() => setShowTip(false)}
                className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
                aria-label="Dismiss tip"
              >
                &times;
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main Feature */}
        <MainFeature />
        
        {/* Recent Templates */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-surface-800 dark:text-surface-100">
            Recent Templates
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <motion.div 
                key={item}
                whileHover={{ y: -5 }}
                className="card p-4 cursor-pointer"
              >
                <div className="aspect-[8.5/11] bg-surface-100 dark:bg-surface-700 rounded-lg mb-3 overflow-hidden">
                  <img 
                    src={`https://source.unsplash.com/random/300x400?invoice,${item}`} 
                    alt="Invoice template" 
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
                <h3 className="font-medium">Invoice Template {item}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  Last edited {item} day{item !== 1 ? 's' : ''} ago
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home