import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <Header onMenuClick={() => {}} />
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default PublicLayout


