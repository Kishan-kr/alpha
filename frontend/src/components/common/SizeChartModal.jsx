import React, { useRef, useEffect, useState } from "react";
import measurementGuideImage from "../../assets/photos/measurement_guide.jpg";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { overSizedTeeSizeInCentimeter, overSizedTeeSizeInInches } from "../../constants/sizeTable";

const SizeChartModal = ({ onClose }) => {
  const contentRef = useRef(null);
  const [unit, setUnit] = useState('cm')

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.classList.add("overflow-hidden", "h-screen");

    return () => {
      document.body.classList.remove("overflow-hidden", "h-screen");
    };
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (contentRef.current && !contentRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  const sizeMap = unit === 'cm' ? overSizedTeeSizeInCentimeter : overSizedTeeSizeInInches;

  return (
    <AnimatePresence>
    <section className="fixed inset-0 z-50 bg-light/80 overflow-y-auto">
      <motion.div
          ref={contentRef}
          initial={{ x: "100%" }} // Slide in from right
          animate={{ x: 0 }}
          exit={{ x: "100%" }} // Slide out to right on unmount
          transition={{ type: "tween", duration: 0.3 }}
          className="w-full sm:max-w-xs bg-light sm:ms-auto p-4 sm:p-8 h-full relative"
        >
        {/* Close button (absolute to this modal container) */}
        <button
          className="fixed top-2 right-4 z-50 p-1 text-dark enabled:cursor-pointer"
          onClick={onClose}
        >
          <X strokeWidth={1} size={20} />
        </button>

        {/* Title and Description */}
        <div className="max-w-md mx-auto text-center mt-4">
          <h2 className="text-base font-light tracking-wide text-left">
            PRODUCT MEASUREMENTS
          </h2>
          <p className="text-xxs font-light text-dark mt-2 text-left">
            The measurements may vary slightly due to the production process.
            The garment is measured on a flat surface
          </p>
        </div>

        {/* Image with Labels */}
        <div className="max-w-md mx-auto mt-6">
          <img
            src={measurementGuideImage}
            alt="Size measurement"
            className="w-full"
          />
        </div>

        {/* CM / IN Toggle */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button onClick={() => setUnit('cm')} className={`text-xxs font-medium tracking-wider pb-1 enabled:cursor-pointer ${unit === 'cm' ? 'text-black border-b-2 border-black' : 'text-subtext'}`}>
            CM
          </button>
          <button onClick={() => setUnit('in')} className={`text-xxs font-medium tracking-wider pb-1 enabled:cursor-pointer ${unit === 'in' ? 'text-black border-b-2 border-black' : 'text-subtext'}`}>
            IN
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4 sm:pb-6">
          <table className="min-w-full text-xs text-left">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="py-2 pr-4">AREA</th>
                <th className="py-2 pr-4 uppercase">S</th>
                <th className="py-2 pr-4 uppercase">M</th>
                <th className="py-2 pr-4 uppercase">L</th>
                <th className="py-2 pr-4 uppercase">XL</th>
              </tr>
            </thead>
            <tbody className="text-subtext">{
              Object.entries(sizeMap).map(([key, values]) => (
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4">{key}</td>
                {values.map(value => (
                  <td className="py-2 pr-4 w-8">{value.toFixed(1)}</td>

                ))}
                {/* <td className="py-2 pr-4">58.5</td>
                <td className="py-2 pr-4">60.5</td>
                <td className="py-2 pr-4">62.5</td> */}
              </tr>

              ))}
              {/* <tr className="border-b border-gray-100">
                <td className="py-2 pr-4">Length</td>
                <td className="py-2 pr-4">77.0</td>
                <td className="py-2 pr-4">79.0</td>
                <td className="py-2 pr-4">81.0</td>
                <td className="py-2 pr-4">83.0</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4">Shoulder</td>
                <td className="py-2 pr-4">61.0</td>
                <td className="py-2 pr-4">63.0</td>
                <td className="py-2 pr-4">65.0</td>
                <td className="py-2 pr-4">67.0</td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
    </AnimatePresence>
  );
};

export default SizeChartModal;