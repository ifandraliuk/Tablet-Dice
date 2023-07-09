import React from 'react'
import { motion } from "framer-motion";
function ExclamationMark() {
  return (
    <motion.div className='exclamation'
    initial={{
        y: 0
    }}
    animate={{
        translateY: -5
    }}
    transition={{
        repeat: Infinity,
        type: "spring",
        stiffness: 150,
    }}
    >!</motion.div>
  )
}

export default ExclamationMark