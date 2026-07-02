'use client';

import { useState } from "react";
import { 
  Facebook, 
  Twitter, 
  MessageCircle, 
  Linkedin, 
  Send, 
  Mail, 
  Copy, 
  Check,
  X,
  Link as LinkIcon,
  Share,
  Heart,
  Megaphone
} from "lucide-react";

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
    { 
      name: "Facebook", 
      icon: <Facebook size={20} className="text-white fill-current" aria-hidden="true" />, 
      bg: "bg-[#1877F2] hover:bg-[#166FE5]",
      description: "Share on Facebook"
    },
    { 
      name: "Twitter", 
      icon: <Twitter size={20} className="text-white fill-current" aria-hidden="true" />, 
      bg: "bg-[#1DA1F2] hover:bg-[#1A91DA]",
      description: "Post on Twitter"
    },
    { 
      name: "WhatsApp", 
      icon: <MessageCircle size={20} className="text-white" aria-hidden="true" />, 
      bg: "bg-[#25D366] hover:bg-[#22C55E]",
      description: "Share via WhatsApp"
    },
    { 
      name: "LinkedIn", 
      icon: <Linkedin size={20} className="text-white fill-current" aria-hidden="true" />, 
      bg: "bg-[#0A66C2] hover:bg-[#095BA6]",
      description: "Share on LinkedIn"
    },
    { 
      name: "Telegram", 
      icon: <Send size={20} className="text-white" aria-hidden="true" />, 
      bg: "bg-[#0088CC] hover:bg-[#007BB5]",
      description: "Send via Telegram"
    },
    { 
      name: "Email", 
      icon: <Mail size={20} className="text-white" aria-hidden="true" />, 
      bg: "bg-[#EA4335] hover:bg-[#DB3E2F]",
      description: "Share via Email"
    },
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-campaign-title"
    >
      <div className="bg-paper-glass backdrop-blur-md border border-rule rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          aria-label="Close share dialog"
          className="absolute top-4 right-4 p-2 text-ink-2 hover:text-ink hover:bg-paper-2-glass hover:backdrop-blur rounded-full transition-all duration-200"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <h3 
          id="share-campaign-title"
          className="text-xl sm:text-2xl font-bold mb-2 text-center text-ink flex items-center justify-center gap-2"
        >
          <Heart size={22} className="text-error fill-current" aria-hidden="true" />
          Share This Campaign
        </h3>
        <p className="text-ink-2 text-center mb-6 text-xs sm:text-sm flex items-center justify-center gap-1.5">
          <Megaphone size={16} className="text-accent" aria-hidden="true" />
          Help spread the word and make a difference
        </p>

        {/* Social media button grid */}
        <div className="mb-6 grid grid-cols-3 gap-2">
          {icons.map(({ name, icon, bg, description }) => (
            <button
              key={name}
              onClick={shareHandlers[name]}
              className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-paper-2-glass hover:backdrop-blur transition-all duration-200 group"
              aria-label={description}
            >
              <div className={`flex items-center justify-center w-12 h-12 ${bg} rounded-full mb-2 transition-all duration-200 shadow-md`}>
                {icon}
              </div>
              <span className="text-xs font-semibold text-ink-2 group-hover:text-ink transition-colors duration-200">{name}</span>
            </button>
          ))}
        </div>

        {/* Copy link section */}
        <div className="mb-6">
          <label htmlFor="campaignUrl" className="text-xs font-semibold text-ink-2 mb-2 flex items-center gap-2">
            <LinkIcon size={14} className="text-ink-2" aria-hidden="true" />
            Campaign Link
          </label>
          <div className="flex items-center shadow-sm rounded-lg overflow-hidden border border-rule-strong">
            <input
              id="campaignUrl"
              type="text"
              value={campaignUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-paper-2-glass backdrop-blur text-ink text-xs focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 text-white font-bold text-xs transition-all duration-200 shrink-0 ${
                isCopied 
                  ? 'bg-success hover:bg-green-700' 
                  : 'bg-accent hover:bg-accent-hover'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {isCopied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                <span>{isCopied ? "Copied!" : "Copy"}</span>
              </div>
            </button>
          </div>
          <p className="text-[10px] text-ink-2 mt-2 flex items-center gap-1 font-medium">
            <Share size={10} aria-hidden="true" />
            Anyone with this link can view the campaign
          </p>
        </div>

        {/* Bottom Close button */}
        <button
          onClick={onClose}
          className="w-full px-6 h-10 bg-paper-3-glass backdrop-blur-sm border border-rule-strong text-ink rounded-lg font-bold text-xs hover:bg-paper-2-glass hover:backdrop-blur transition-all duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ShareCampaignModal;