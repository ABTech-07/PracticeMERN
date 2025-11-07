import { useState } from 'react'
import { ShoppingCart, User, Package } from 'lucide-react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">E-Commerce Store</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn-secondary flex items-center">
                <User className="h-5 w-5 mr-2" />
                Login
              </button>
              <button className="btn-primary flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart (0)
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 MERN E-Commerce Setup Complete!
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Vite + React + Tailwind CSS is working perfectly!
          </p>
          
          {/* Test Counter */}
          <div className="card max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-4">Test Counter</h3>
            <button 
              onClick={() => setCount((count) => count + 1)}
              className="btn-primary"
            >
              Count is {count}
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Click the button to test React state and Tailwind styles!
            </p>
          </div>

          {/* Next Steps */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="card">
              <Package className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Products</h3>
              <p className="text-gray-600 text-sm">Browse and manage products</p>
            </div>
            <div className="card">
              <ShoppingCart className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Shopping Cart</h3>
              <p className="text-gray-600 text-sm">Add items and checkout</p>
            </div>
            <div className="card">
              <User className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">User Account</h3>
              <p className="text-gray-600 text-sm">Login and manage profile</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
