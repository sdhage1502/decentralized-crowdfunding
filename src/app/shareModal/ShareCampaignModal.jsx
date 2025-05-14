"use client";
import { useState } from "react";
import { FaFacebookF, FaTwitter, FaWhatsapp, FaLinkedinIn, FaTelegramPlane, FaEnvelope } from "react-icons/fa";

const ShareCampaignModal = ({ isOpen, onClose, campaignUrl, campaignTitle }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(campaignUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shareHandlers = {
    Facebook: () =>
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(campaignUrl)}`, "_blank"),
    Twitter: () =>
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("Support this campaign: " + campaignTitle)}&url=${encodeURIComponent(campaignUrl)}`, "_blank"),
    WhatsApp: () =>
      window.open(`https://wa.me/?text=${encodeURIComponent("Support this campaign: " + campaignTitle + " " + campaignUrl)}`, "_blank"),
    LinkedIn: () =>
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(campaignUrl)}`, "_blank"),
    Telegram: () =>
      window.open(`https://t.me/share/url?url=${encodeURIComponent(campaignUrl)}&text=${encodeURIComponent("Support this campaign: " + campaignTitle + " " + campaignUrl)}`, "_blank"),
    Email: () =>
      window.open(`mailto:?subject=${encodeURIComponent("Support this campaign: " + campaignTitle)}&body=${encodeURIComponent("Check out this campaign: " + campaignUrl)}`),
  };

  const icons = [
    { name: "Facebook", icon: <FaFacebookF className="text-white" />, bg: "bg-blue-600" },
    { name: "Twitter", icon: <FaTwitter className="text-white" />, bg: "bg-blue-400" },
    { name: "WhatsApp", icon: <FaWhatsapp className="text-white" />, bg: "bg-green-500" },
    { name: "LinkedIn", icon: <FaLinkedinIn className="text-white" />, bg: "bg-blue-700" },
    { name: "Telegram", icon: <FaTelegramPlane className="text-white" />, bg: "bg-blue-500" },
    { name: "Email", icon: <FaEnvelope className="text-white" />, bg: "bg-gray-600" },
  ];

  if (!isOpen) return null;

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold mb-6">Share This Campaign</h3>

      <div className="mb-6 grid grid-cols-3 gap-6">
        {icons.map(({ name, icon, bg }) => (
          <button
            key={name}
            onClick={shareHandlers[name]}
            className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className={`flex items-center justify-center w-12 h-12 ${bg} rounded-full mb-2`}>
              {icon}
            </div>
            <span className="text-sm font-medium">{name}</span>
          </button>
        ))}
      </div>

      <div className="mb-6">
        <div className="flex items-center">
          <input
            type="text"
            value={campaignUrl}
            readOnly
            className="flex-1 px-4 py-3 border rounded-l-lg bg-gray-50"
          />
          <button
            onClick={handleCopyLink}
            className="px-4 py-3 bg-[#3247C5] text-white rounded-r-lg hover:bg-[#2a3aa0] transition-colors"
          >
            {isCopied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      <button
        onClick={onClose}
        className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors"
      >
        Close
      </button>
    </div>
  );
};

export default ShareCampaignModal;
