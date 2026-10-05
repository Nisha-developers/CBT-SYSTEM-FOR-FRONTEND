import React from 'react';
import Modal from './Modal';
import { Smartphone, ShieldAlert } from 'lucide-react';

const DetectMobile = () => {
  return (
    <div>
      <Modal open={true} title="Mobile Device Detected">
  <div className="text-center space-y-4 py-2">
    
    <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
      <Smartphone className="w-7 h-7 text-blue-600" />
    </div>

    <p className="text-sm text-gray-600 leading-relaxed">
      This device belongs to the mobile. Please use a desktop or laptop computer to 
      take the examination.
    </p>

    <div className="flex items-start gap-2.5 p-3 bg-blue-50 rounded-lg border border-blue-100 text-left">
      <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
      <p className="text-xs text-blue-700 leading-relaxed">
        Exams are optimized for larger screens. 
      </p>
    </div>
  </div>
</Modal>
    </div>
  )
}

export default DetectMobile
