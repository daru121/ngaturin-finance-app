import React from 'react';
import { motion } from 'framer-motion';

const Preloader = ({ onLoadingComplete }) => {
  const containerVariants = {
    initial: {
      opacity: 1
    },
    exit: {
      opacity: 0,
      transition: {
        delay: 0.2,
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  const logoVariants = {
    initial: { 
      scale: 0.8,
      opacity: 0,
      y: 20
    },
    animate: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const textVariants = {
    initial: { 
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const barVariants = {
    initial: { 
      scaleX: 0,
      originX: 0
    },
    animate: {
      scaleX: 1,
      transition: {
        delay: 1,
        duration: 1,
        ease: "easeInOut"
      }
    }
  };

  const finalAnimation = {
    initial: {
      y: 0
    },
    animate: {
      y: -100,
      transition: {
        delay: 2.2,
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onAnimationComplete={() => {
        setTimeout(onLoadingComplete, 3000);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50"
    >
      <motion.div
        variants={finalAnimation}
        initial="initial"
        animate="animate"
        className="flex flex-col items-center"
      >
        {/* Logo */}
        <motion.div
          variants={logoVariants}
          className="mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg"
        >
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M4 7C4 5.89543 4.89543 5 6 5H18C19.1046 5 20 5.89543 20 7V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V7Z" 
              stroke="white" 
              strokeWidth="2"
            />
            <path 
              d="M8 9H16M8 12H16M8 15H13" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* App Name */}
        <motion.div variants={textVariants} className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Ngaturin
          </h1>
          <p className="text-gray-500 text-sm">Atur Keuangan dengan Mudah</p>
        </motion.div>

        {/* Loading Bar */}
        <motion.div className="w-48 h-1 bg-gray-100 rounded-full mt-8 overflow-hidden">
          <motion.div
            variants={barVariants}
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Preloader; 