import React, { useRef } from 'react';

const OTPInput = ({ length = 6, onChangeOTP, customStyle }) => {
  const inputsRef = useRef([...Array(length)].map(() => React.createRef()));

  const handleChange = (e, index) => {
    const value = e.target.value;
    // Accept only digits
    if (!/^\d?$/.test(value)) {
      inputsRef.current[index].current.value = '';
      return
    };
    
    // Prevent entering more than one character
    if (value.length > 1) return; 

    const otp = inputsRef.current.map(ref => ref.current.value).join('');
    onChangeOTP(otp);

    if (value && index < length - 1) {
      // Move focus to the next input
      inputsRef.current[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      // Move focus to the previous input
      inputsRef.current[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const digitsOnly = paste.replace(/\D/g, '').split('');

    digitsOnly.forEach((value, index) => {
      if (index < length) {
        inputsRef.current[index].current.value = value;
        onChangeOTP(inputsRef.current.map(ref => ref.current.value).join(''));
      }
    });

    if (digitsOnly.length < length) {
      inputsRef.current[digitsOnly.length].current.focus();
    }
    else {
      inputsRef.current[length - 1].current.focus()
    }
  };

  return (
    <div className="otp-input flex gap-1 sm:gap-2 justify-between">
      {inputsRef.current.map((ref, index) => (
        <input
          key={index}
          ref={ref}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength="1"
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className='p-2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-dark bg-light border border-border text-center'
          style={customStyle}
        />
      ))}
    </div>
  );
};

export default OTPInput;