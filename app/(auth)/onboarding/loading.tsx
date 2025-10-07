import React from 'react'
import { LoaderPinwheelIcon } from 'lucide-react'

const loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <LoaderPinwheelIcon className="animate-spin text-5xl" />
    </div>
  )
}

export default loading