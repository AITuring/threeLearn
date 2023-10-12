import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import Start from './Start.tsx'
import PingPong from './PingPong.tsx'
import Planet from './Planet.tsx'
import Line from './Line.tsx'
import Sprite from './Sprite.tsx'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/start',
    element: <Start />
  },
  {
    path: '/pingpong',
    element: <PingPong />
  },
  {
    path: '/planet',
    element: <Planet />
  },
  {
    path: '/line',
    element: <Line />
  },
  {
    path: '/sprite',
    element: <Sprite />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
