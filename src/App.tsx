import { RouterProvider } from 'react-router-dom'
import { OrdersProvider } from './contexts/OrdersContext'
import { router } from './routes'

function App() {
  return (
    <OrdersProvider>
      <RouterProvider router={router} />
    </OrdersProvider>
  )
}

export default App
