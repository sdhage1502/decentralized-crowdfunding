"use client";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { AlertCircle, Info, X, Check, Copy } from "lucide-react";

/**
 * UPI Payment Modal
 *
 * This is an OFF-CHAIN donation method. Payments made via UPI are sent
 * directly to the campaign creator's UPI ID using India's UPI network.
 * They are NOT tracked on the blockchain and do NOT update campaign
 * on-chain statistics. The campaign creator receives the funds directly.
 */
const UpiPaymentModal = ({ isOpen, onClose, upiId, campaignTitle }) => {
  const [amount, setAmount] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Generate dynamic UPI payment deep link
  const generateUpiLink = () => {
    let baseLink = `upi://pay?pa=${upiId}`;
    if (campaignTitle) baseLink += `&pn=${encodeURIComponent(campaignTitle)}`;
    if (amount && !isNaN(parseFloat(amount))) baseLink += `&am=${amount}`;
    baseLink += "&cu=INR";
    return baseLink;
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener("keydown", handleEsc);

    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Close on backdrop click
  const handleOutsideClick = (e) => {
    if (e.target.id === "upi-modal-backdrop") {
      onClose();
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      id="upi-modal-backdrop"
      className="fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOutsideClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upi-payment-title"
    >
      <div className="bg-paper-glass backdrop-blur-md border border-rule rounded-xl overflow-hidden shadow-2xl max-w-md w-full mx-auto relative">
        {/* Header */}
        <div className="bg-accent-bg border-b border-rule p-5 flex items-center justify-between">
          <div>
            <h3 id="upi-payment-title" className="text-lg font-bold text-accent">
              Pay with UPI
            </h3>
            <p className="text-ink-2 text-xs mt-0.5 font-medium truncate max-w-[300px]">
              {campaignTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close UPI payment dialog"
            className="p-1.5 rounded-full hover:bg-paper-3-glass hover:backdrop-blur-sm text-ink-2 hover:text-ink transition-colors"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Off-chain disclaimer banner */}
        <div className="bg-warning-bg border-b border-warning-border px-4 py-3 flex items-start gap-2.5">
          <AlertCircle size={16} className="text-warning mt-0.5 shrink-0" aria-hidden="true" />
          <div className="text-xs text-ink-2 leading-relaxed">
            <p className="font-bold text-ink mb-0.5">Off-Chain Donation</p>
            <p>
              UPI transfers go directly to the campaign creator. This transaction is <strong>not recorded on the blockchain</strong> and will not increment the campaign's on-chain stats.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Amount input */}
          <div>
            <label
              className="block text-xs font-semibold text-ink-2 mb-1.5 uppercase tracking-wider"
              htmlFor="upi-amount"
            >
              Enter Amount (₹)
            </label>
            <input
              type="number"
              id="upi-amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount in INR"
              className="w-full p-2.5 bg-paper-glass backdrop-blur-md border border-rule-strong rounded-lg text-sm text-ink focus:outline-none focus:ring-1 focus:ring-accent"
              min="1"
              step="any"
            />
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center justify-center">
            <div className="bg-paper-2-glass backdrop-blur p-4 rounded-xl border border-rule shadow-sm">
              <QRCodeSVG
                value={generateUpiLink()}
                size={180}
                fgColor="#000000"
                bgColor="#ffffff"
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="mt-3 text-ink-2 text-xs text-center flex items-center gap-1.5 font-medium">
              <Info size={14} className="text-accent" aria-hidden="true" />
              Scan with GPay, PhonePe, Paytm, or any UPI app
            </p>
          </div>

          {/* UPI ID copy row */}
          <div className="flex items-center justify-between bg-paper-2-glass backdrop-blur p-3 rounded-lg border border-rule">
            <span className="font-mono text-ink text-xs truncate mr-4">
              {upiId}
            </span>
            <button
              onClick={copyUpiId}
              className={`px-3 py-1.5 text-white font-bold text-xs rounded transition-all duration-200 shrink-0 ${
                isCopied 
                  ? 'bg-success hover:bg-green-700' 
                  : 'bg-accent hover:bg-accent-hover'
              }`}
            >
              <div className="flex items-center gap-1">
                {isCopied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
                <span>{isCopied ? "Copied" : "Copy"}</span>
              </div>
            </button>
          </div>

          <p className="text-[10px] text-ink-2 text-center opacity-75 font-semibold uppercase tracking-wider">
            QR code updates dynamically as you enter an amount
          </p>

          <button
            onClick={onClose}
            className="w-full px-6 h-10 bg-paper-3-glass backdrop-blur-sm border border-rule-strong text-ink rounded-lg font-bold text-xs hover:bg-paper-2-glass hover:backdrop-blur transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpiPaymentModal;
