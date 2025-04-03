import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, AlertTriangle } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh] text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="neu-card max-w-md w-full flex flex-col items-center"
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-6">
          <AlertTriangle size={32} className="text-primary" />
        </div>
        
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold mb-4 text-surface-800 dark:text-surface-100">
          Page Not Found
        </h2>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <motion.div whileTap={{ scale: 0.97 }}>
          <Link 
            to="/" 
            className="btn btn-primary flex items-center gap-2 px-6"
          >
            <Home size={18} />
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound