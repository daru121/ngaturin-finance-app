import React from 'react';
import { motion } from 'framer-motion';

function Settings() {
  // Animation variants for the robot
  const robotVariants = {
    hover: {
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    rotate: {
      rotate: [0, -5, 5, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Animation variants for the gear
  const gearVariants = {
    rotate: {
      rotate: 360,
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white/80 pb-28 sm:pb-8">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="absolute inset-0 bg-white/50 rounded-2xl backdrop-blur-xl transform rotate-6 scale-90 group-hover:rotate-12 transition-transform duration-300"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-3 sm:p-4 rounded-2xl shadow-lg transform transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pengaturan</h1>
            <p className="text-sm text-gray-500 mt-1">Konfigurasi dan informasi aplikasi</p>
          </div>
        </div>

        {/* Work in Progress Content */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 px-4 py-6">
          {/* Text Content */}
          <motion.div
            className="text-center sm:text-left max-w-sm order-2 sm:order-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
              WORK IN PROGRESS
            </h2>
            <p className="text-gray-600">
              Halaman ini sedang dalam pengembangan. Kami sedang mempersiapkan fitur-fitur baru yang akan membantu Anda mengelola keuangan dengan lebih baik.
            </p>
          </motion.div>

          {/* Animated Robot */}
          <div className="relative w-32 h-32 order-1 sm:order-2 mb-4 sm:mb-0">
            {/* Background Glow */}
            <motion.div
              className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Robot Body */}
            <motion.div
              className="relative w-full h-full"
              variants={robotVariants}
              animate={["hover", "rotate"]}
            >
              {/* Robot Head */}
              <motion.div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                {/* Eyes */}
                <div className="absolute top-4 left-3 w-2.5 h-2.5 bg-white rounded-full"></div>
                <div className="absolute top-4 right-3 w-2.5 h-2.5 bg-white rounded-full"></div>
                {/* Mouth */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-5 h-1 bg-white rounded-full"></div>
              </motion.div>

              {/* Robot Body */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-20 h-28 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl shadow-lg">
                {/* Gear decoration */}
                <motion.div
                  className="absolute -right-3 top-3 w-6 h-6 text-blue-300"
                  variants={gearVariants}
                  animate="rotate"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings; 