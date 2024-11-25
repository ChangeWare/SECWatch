import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './common/layouts/AppLayout'
import { ToastContainer } from 'react-toastify'

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        {/* Add more routes as needed */}
      </Routes>
      <ToastContainer />
    </AppLayout>
  )
}

export default App