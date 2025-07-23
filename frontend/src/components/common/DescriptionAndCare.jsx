import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Collapsible = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-3">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex justify-between items-center w-full text-left uppercase enabled:cursor-pointer ${isOpen? "font-medium": "font-light"} text-xs`}
      >
        <span>{title}</span>
        {isOpen ? <Minus size={14} strokeWidth={1} /> : <Plus size={14} strokeWidth={1} />}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { height: 'auto', opacity: 1 },
              collapsed: { height: 0, opacity: 0 }
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-2 text-subtext font-light text-sm space-y-1 px-0.5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


function DescriptionAndCare({ description }) {
  return (
    <div className="divide-y">
      <Collapsible title="Description">
        {description}
        {/* {description?.map((line, idx) => (
          <p key={idx}>{line}</p>
        ))} */}
      </Collapsible>

      <Collapsible title="Composition and Care">
        <div>
          <h4 className="font-medium">Composition</h4>
          <p>100% Terry Cotton</p>
        </div>
        <div className="mt-2">
          <h4 className="font-medium">Care</h4>
          <p>
            Machine wash. Do not iron directly or scrub on print. Dry on a flat
            surface as hanging may cause measurement variations.
          </p>
        </div>
      </Collapsible>

      <Collapsible title="Shipment and Delivery">
        <p>
          All orders will be delivered in 3 - 7 business days. Please note that
          delivery times may vary depending on your location.
        </p>
      </Collapsible>

      <Collapsible title="Return and Exchange">
        <p>
          You have 3 days from the delivery date to initiate a return or exchange.
          <br />
          The cost of the return applies to each request and will be deducted from the refund amount.
        </p>

        <p className='mt-4'>For more information, we suggest you read our full <a href="/returns" className='underline'>return or exchange policy</a>.</p>
      </Collapsible>
    </div>
  );
}

export default DescriptionAndCare;