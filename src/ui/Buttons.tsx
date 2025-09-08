import { motion } from "framer-motion";

interface UploadButtonProps {
  setIsOpen: (value: boolean) => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ setIsOpen }) => {
  return (
    <motion.button
      onClick={() => setIsOpen(true)}
      className="bg-blue-900 text-white h-12 w-12 sm:h-14 sm:w-14 fixed right-4 sm:right-10 bottom-6 sm:bottom-10 rounded-full text-2xl sm:text-3xl flex items-center justify-center shadow-lg border border-blue-700 z-50"
      aria-label="Upload Assignment"
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      animate={{
        backgroundColor: ["#1e3a8a", "#06b6d4", "#7c3aed", "#1e3a8a"], // deep blue → cyan → purple → back
        boxShadow: [
          "0 0 5px rgba(30, 58, 138, 0.8)",
          "0 0 30px rgba(6, 182, 212, 1)",
          "0 0 30px rgba(124, 58, 237, 1)",
          "0 0 5px rgba(30, 58, 138, 0.8)"
        ]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      +
    </motion.button>
  );
};

export default UploadButton;



