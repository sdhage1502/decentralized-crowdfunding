"use client";
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

const UpiQrGenerator = ({ upiId, amount, name = "", merchantCode = "" }) => {
  const [qrValue, setQrValue] = useState("");
  const [isUpiValid, setIsUpiValid] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Validate UPI ID format
    const isValid = upiId && upiId.includes('@');
    setIsUpiValid(isValid);

    if (isValid) {
      // Build UPI payment URL with all parameters
      let upiUrl = `upi://pay?pa=${upiId}`;
      
      if (name) upiUrl += `&pn=${encodeURIComponent(name)}`;
      if (amount && !isNaN(parseFloat(amount))) upiUrl += `&am=${amount}`;
      if (merchantCode) upiUrl += `&mc=${merchantCode}`;
      
      // Add currency (INR by default)
      upiUrl += `&cu=INR`;
      
      setQrValue(upiUrl);
    }
  }, [upiId, amount, name, merchantCode]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isUpiValid) {
    return (
      <div className="bg-error-bg border border-error-border text-error p-4 rounded-lg text-center break-words">
        Invalid UPI ID format. Please use format: username@provider
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 rounded-xl border border-rule-strong shadow-sm">
        <QRCodeSVG 
          value={qrValue}
          size={240}
          fgColor="#000000"
          bgColor="#ffffff"
          level="H"
          includeMargin={true}
        />
      </div>
      
      <div className="mt-4 w-full">
        <div className="flex min-w-0 items-center justify-between bg-paper-3-glass backdrop-blur-sm p-3 rounded-lg border border-rule">
          <span className="min-w-0 font-semibold text-ink text-xs truncate mr-4">{upiId}</span>
          <button 
            onClick={handleCopyUpi}
            className="bg-accent hover:bg-accent-hover text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm shrink-0"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        
        <div className="text-[10px] text-ink-2 mt-2 text-center font-semibold uppercase tracking-wider">
          Scan with any UPI app to pay
        </div>
      </div>
    </div>
  );
};

export default UpiQrGenerator;