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
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animate, setAnimate] = useState(false);

  // Generate dynamic UPI payment deep link
  const generateUpiLink = () => {
    let baseLink = `upi://pay?pa=${upiId}`;
    if (campaignTitle) baseLink += `&pn=${encodeURIComponent(campaignTitle)}`;
    if (amount && !isNaN(parseFloat(amount))) baseLink += `&am=${amount}`;
    baseLink += "&cu=INR";
    return baseLink;
  };

  // Close modal on Escape key and handle animations
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener("keydown", handleEsc);

    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => setAnimate(true), 10);
      return () => {
        window.removeEventListener("keydown", handleEsc);
        document.body.style.overflow = "unset";
        clearTimeout(timer);
      };
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setShouldRender(false), 250);
      return () => {
        window.removeEventListener("keydown", handleEsc);
        document.body.style.overflow = "unset";
        clearTimeout(timer);
      };
    }
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

  if (!shouldRender) return null;

  return (
    <div
      id="upi-modal-backdrop"
      className={`fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-200 ${
        animate ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleOutsideClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upi-payment-title"
    >
      <div 
        className={`bg-paper-glass backdrop-blur-md border border-rule rounded-xl overflow-hidden shadow-2xl max-w-md w-full max-h-[calc(100dvh-2rem)] overflow-y-auto mx-auto relative transition-all duration-250 [transition-timing-function:var(--ease-out)] ${
          animate ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="bg-accent-bg border-b border-rule p-4 sm:p-5 flex items-start justify-between gap-3">
          <div>
            <h3 id="upi-payment-title" className="text-lg font-bold text-accent">
              Pay with UPI
            </h3>
            <p className="text-ink-2 text-xs mt-0.5 font-medium truncate max-w-[min(18rem,70vw)]">
              {campaignTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close UPI payment dialog"
            className="p-1.5 rounded-full hover:bg-paper-3-glass hover:backdrop-blur-sm text-ink-2 hover:text-ink btn-active-feedback transition-colors"
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

        <div className="p-4 sm:p-6 space-y-6">
          {/* Amount input */}
          <div>
            <label
              className="block text-xs font-semibold text-ink-2 mb-1.5 uppercase tracking-wider"
              htmlFor="upi-amount"
            >
              Enter Amount (INR)
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
          <div className="flex min-w-0 items-center justify-between bg-paper-2-glass backdrop-blur p-3 rounded-lg border border-rule">
            <span className="min-w-0 font-mono text-ink text-xs truncate mr-4">
              {upiId}
            </span>
            <button
              onClick={copyUpiId}
              className={`px-3 py-1.5 text-white font-bold text-xs rounded btn-active-feedback transition-all duration-200 shrink-0 ${
                isCopied 
                  ? 'bg-success hover:bg-success/90' 
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
            className="w-full px-6 h-10 bg-paper-3-glass backdrop-blur-sm border border-rule-strong text-ink rounded-lg font-bold text-xs hover:bg-paper-2-glass hover:backdrop-blur btn-active-feedback transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpiPaymentModal;
