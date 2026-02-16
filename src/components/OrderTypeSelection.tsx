import { motion } from 'motion/react';
import { ShoppingBag, Users } from 'lucide-react';

interface OrderTypeSelectionProps {
  onSelectToGo: () => void;
  onSelectCatering: () => void;
}

export function OrderTypeSelection({ onSelectToGo, onSelectCatering }: OrderTypeSelectionProps) {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl lg:text-4xl text-[#753221] mb-2">Choose Your Order Type</h1>
          <p className="text-gray-600 text-base">Select how you'd like to order from Passariello's</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* To Go Card */}
          <motion.button
            onClick={onSelectToGo}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 lg:p-8 border-2 border-transparent hover:border-[#A72020] group"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-[#A72020] to-[#753221] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl text-[#753221] mb-2">To Go</h2>
                <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                  Order for pickup or delivery
                  <br />
                  Perfect for individuals and families
                </p>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center px-5 py-2.5 bg-[#A72020] text-white rounded-full group-hover:bg-[#8B1A1A] transition-colors text-sm">
                  Start Your Order
                </span>
              </div>
            </div>
          </motion.button>

          {/* Catering Card */}
          <motion.button
            onClick={onSelectCatering}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 lg:p-8 border-2 border-transparent hover:border-[#A72020] group"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-[#A72020] to-[#753221] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl text-[#753221] mb-2">Catering</h2>
                <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                  Order for events and large groups
                  <br />
                  Perfect for parties and gatherings
                </p>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center px-5 py-2.5 bg-[#A72020] text-white rounded-full group-hover:bg-[#8B1A1A] transition-colors text-sm">
                  View Catering Menu
                </span>
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}