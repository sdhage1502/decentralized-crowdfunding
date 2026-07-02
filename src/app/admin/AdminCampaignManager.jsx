'use client';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase/config';
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import { sendApprovalEmail, sendRejectionEmail } from '../../utils/emailService';
import { registerCampaignOnChain } from '../../utils/contractService';
import { 
  ShieldAlert, CheckCircle, AlertTriangle, Eye, Trash2, 
  ToggleLeft, ToggleRight, FileText, Mail, Phone, Users, Wallet,
  Inbox, Loader2, RefreshCw, BarChart2, Target
} from 'lucide-react';

const isAdmin = (email) => {
  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (!ADMIN_EMAIL) {
    console.error('NEXT_PUBLIC_ADMIN_EMAIL is not defined in environment variables');
    toast.error('Admin email configuration missing');
    return false;
  }
  return email === ADMIN_EMAIL;
};

const AdminCampaignManager = () => {
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState({
    pending: [],
    rejected: [],
    all: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (u) => {
        if (u && isAdmin(u.email)) {
          setUser(u);
        } else {
          setUser(null);
          setError('Unauthorized: Admins only');
          toast.error('Unauthorized: Admins only');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Auth state change error:', err);
        setError(`Authentication error: ${err.message}`);
        setLoading(false);
        toast.error(`Authentication error: ${err.message}`);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCampaigns();
    }
  }, [user]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);

      const campaignsRef = collection(db, 'campaigns');

      const pendingQuery = query(
        campaignsRef,
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
      const pendingSnapshot = await getDocs(pendingQuery);
      const pendingData = pendingSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const rejectedQuery = query(
        campaignsRef,
        where('status', '==', 'rejected'),
        orderBy('createdAt', 'desc')
      );
      const rejectedSnapshot = await getDocs(rejectedQuery);
      const rejectedData = rejectedSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const allQuery = query(campaignsRef, orderBy('createdAt', 'desc'));
      const allSnapshot = await getDocs(allQuery);
      const allData = allSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((campaign) => campaign.deleted !== true);

      setCampaigns({
        pending: pendingData,
        rejected: rejectedData,
        all: allData,
      });
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      let errorMessage = `Failed to fetch campaigns: ${err.message}`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, updates) => {
    try {
      await updateDoc(doc(db, 'campaigns', id), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      await fetchCampaigns();
      toast.success('Campaign updated successfully');
    } catch (err) {
      console.error('Error updating campaign:', err);
      toast.error(`Failed to update campaign: ${err.message}`);
    }
  };

  const handleApprove = async (campaign) => {
    try {
      await updateStatus(campaign.id, { status: 'approved', isActive: true });

      try {
        toast.loading('Registering campaign on blockchain...', { id: 'onchain' });
        await registerCampaignOnChain(
          campaign.id,
          campaign.walletAddress,
          campaign.amount
        );
        toast.dismiss('onchain');
        toast.success('Campaign registered on-chain ✓');
      } catch (chainErr) {
        toast.dismiss('onchain');
        console.warn('On-chain registration skipped:', chainErr.message);
        toast('On-chain registration skipped (local network may not be running)', {
          icon: '⚠️',
        });
      }

      try {
        await sendApprovalEmail(campaign.email, campaign.title, campaign.id);
      } catch (emailErr) {
        console.error('Error sending approval email:', emailErr);
        toast.error(`Campaign approved, but email failed: ${emailErr.message}`);
        return;
      }
      toast.success(`Campaign "${campaign.title}" approved`);
    } catch (err) {
      console.error('Error approving campaign:', err);
      toast.error(`Failed to approve campaign: ${err.message}`);
    }
  };

  const handleReject = async (campaign) => {
    const reason = prompt('Reason for rejection:');
    if (!reason) {
      toast.error('Rejection reason is required');
      return;
    }
    try {
      await updateStatus(campaign.id, {
        status: 'rejected',
        isActive: false,
        rejectionReason: reason,
      });
      try {
        await sendRejectionEmail(campaign.email, campaign.title, reason);
      } catch (emailErr) {
        console.error('Error sending rejection email:', emailErr);
        toast.error(`Campaign rejected, but failed to send email: ${emailErr.message}`);
        return;
      }
      toast.success(`Campaign "${campaign.title}" rejected`);
    } catch (err) {
      console.error('Error rejecting campaign:', err);
      toast.error(`Failed to reject campaign: ${err.message}`);
    }
  };

  const handleToggleActive = async (id, title, isActive) => {
    try {
      await updateStatus(id, {
        isActive: !isActive,
        status: !isActive ? 'approved' : 'inactive',
      });
      toast.success(
        `Campaign "${title}" ${!isActive ? 'activated' : 'deactivated'}`
      );
    } catch (err) {
      console.error('Error toggling campaign active status:', err);
      toast.error(`Failed to toggle active status: ${err.message}`);
    }
  };

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(
      `⚠️ Permanently delete campaign "${title}"? This cannot be undone.`
    );
    if (!confirmed) return;
    try {
      await deleteDoc(doc(db, 'campaigns', id));
      await fetchCampaigns();
      toast.success(`Campaign "${title}" deleted permanently`);
    } catch (err) {
      console.error('Error deleting campaign:', err);
      toast.error(`Failed to delete campaign: ${err.message}`);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-warning-bg text-warning border-warning-border',
      approved: 'bg-success-bg text-success border-success-border',
      rejected: 'bg-error-bg text-error border-error-border',
      inactive: 'bg-paper-3 text-ink-2 border-rule-strong',
    };
    
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyles[status] || statusStyles.inactive}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
      </span>
    );
  };

  const getUrgencyBadge = (urgency) => {
    const urgencyStyles = {
      critical: 'bg-error-bg text-error border-error-border',
      high: 'bg-warning-bg text-warning border-warning-border',
      medium: 'bg-paper-3 text-ink-2 border-rule-strong',
      low: 'bg-success-bg text-success border-success-border',
    };
    
    if (!urgency) return null;
    
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${urgencyStyles[urgency.toLowerCase()] || urgencyStyles.low}`}>
        {urgency.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-transparent">
        <div className="text-center space-y-3">
          <Loader2 className="animate-spin h-8 w-8 text-accent mx-auto" />
          <p className="text-ink-2 text-xs font-semibold">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto my-8 p-6 bg-error-bg border border-error-border rounded-xl space-y-4">
        <div className="flex items-center gap-3 text-error">
          <ShieldAlert size={28} aria-hidden="true" />
          <h2 className="text-lg font-bold">Failed to load campaigns</h2>
        </div>
        <p className="text-xs text-ink leading-relaxed">{error}</p>
        <button
          onClick={fetchCampaigns}
          className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw size={12} aria-hidden="true" /> Retry Fetch
        </button>
      </div>
    );
  }

  const renderCampaign = (campaign, showAllActions = false) => (
    <div key={campaign.id} className="bg-paper-2-glass backdrop-blur border border-rule rounded-xl p-6 shadow-sm space-y-6">
      
      {/* Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rule">
        <div>
          <h3 className="text-md font-bold text-ink">{campaign.title}</h3>
          <p className="text-[10px] font-mono text-ink-2 mt-0.5">ID: {campaign.id}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {getStatusBadge(campaign.status)}
          {getUrgencyBadge(campaign.urgency)}
          {campaign.isActive && (
            <span className="px-2 py-0.5 bg-success-bg border border-success-border text-success rounded-full text-[10px] font-semibold">
              Live App
            </span>
          )}
        </div>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Specs Details */}
        <div className="md:col-span-8 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1.5">
              <p className="text-ink-2">Creator Details</p>
              <div className="font-semibold space-y-1 text-ink">
                <p className="flex items-center gap-1.5"><Users size={12} className="text-ink-2" aria-hidden="true" /> {campaign.fullName}</p>
                <p className="flex items-center gap-1.5"><Mail size={12} className="text-ink-2" aria-hidden="true" /> {campaign.email}</p>
                <p className="flex items-center gap-1.5"><Phone size={12} className="text-ink-2" aria-hidden="true" /> {campaign.phone}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-ink-2">On-Chain specs</p>
              <div className="font-semibold space-y-1 text-ink">
                <p className="flex items-center gap-1.5"><Target size={12} className="text-ink-2" aria-hidden="true" /> Goal: {campaign.amount} ETH</p>
                <p className="flex items-center gap-1.5"><BarChart2 size={12} className="text-ink-2" aria-hidden="true" /> Collected: {campaign.collected || 0} ETH</p>
                <p className="flex items-center gap-1.5 font-mono text-[10px]"><Wallet size={12} className="text-ink-2" aria-hidden="true" /> {campaign.walletAddress?.slice(0,12)}...</p>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-ink-2 uppercase tracking-wider block">Description</span>
            <p className="text-xs text-ink bg-paper-glass backdrop-blur-md p-3 rounded-lg border border-rule leading-relaxed">
              {campaign.description}
            </p>
          </div>

          {campaign.documents && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-ink-2 uppercase tracking-wider block">Verification Docs</span>
              <div className="flex flex-wrap gap-2">
                {campaign.documents.split(',').map((url, idx) => (
                  <a
                    key={idx}
                    href={url.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent-bg border border-rule-strong text-accent hover:bg-accent hover:text-white rounded-lg text-xs font-semibold transition-all"
                    aria-label={`Report ${idx + 1} (opens in a new tab)`}
                  >
                    <FileText size={12} aria-hidden="true" />
                    Report {idx + 1}
                  </a>
                ))}
              </div>
            </div>
          )}

          {campaign.rejectionReason && (
            <div className="bg-error-bg border border-error-border rounded-lg p-3">
              <span className="text-[10px] font-bold text-error uppercase tracking-wider block">Rejection Reason</span>
              <p className="text-xs text-ink mt-0.5 leading-relaxed">{campaign.rejectionReason}</p>
            </div>
          )}
        </div>

        {/* Media and Action Buttons */}
        <div className="md:col-span-4 flex flex-col justify-between gap-4">
          {campaign.image && (
            <div className="rounded-lg overflow-hidden border border-rule-strong bg-paper-glass backdrop-blur-md">
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-32 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            {campaign.status === 'pending' && (
              <>
                <button
                  onClick={() => handleApprove(campaign)}
                  className="w-full py-2 bg-success hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <CheckCircle size={14} aria-hidden="true" />
                  Approve & Register On-Chain
                </button>
                <button
                  onClick={() => handleReject(campaign)}
                  className="w-full py-2 bg-error hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <AlertTriangle size={14} aria-hidden="true" />
                  Reject Submission
                </button>
              </>
            )}

            {campaign.status !== 'pending' && (
              <button
                onClick={() => handleToggleActive(campaign.id, campaign.title, campaign.isActive)}
                className={`w-full py-2 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm ${
                  campaign.isActive
                    ? 'bg-warning hover:bg-yellow-600'
                    : 'bg-accent hover:bg-accent-hover'
                }`}
              >
                {campaign.isActive ? (
                  <>
                    <ToggleRight size={16} aria-hidden="true" />
                    Deactivate Pool
                  </>
                ) : (
                  <>
                    <ToggleLeft size={16} aria-hidden="true" />
                    Activate Pool
                  </>
                )}
              </button>
            )}

            {showAllActions && (
              <button
                onClick={() => handleDelete(campaign.id, campaign.title)}
                className="w-full py-2 border border-red-200 bg-error-bg hover:bg-red-100 text-error text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 size={14} aria-hidden="true" />
                Delete Permanently
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );

  const tabs = [
    { id: 'pending', label: 'Pending Review', count: campaigns.pending.length },
    { id: 'rejected', label: 'Rejected', count: campaigns.rejected.length },
    { id: 'all', label: 'All Audited', count: campaigns.all.length },
  ];

  const getCurrentCampaigns = () => {
    switch (activeTab) {
      case 'pending':
        return campaigns.pending;
      case 'rejected':
        return campaigns.rejected;
      case 'all':
        return campaigns.all;
      default:
        return [];
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-paper-2-glass backdrop-blur border border-rule rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-warning-bg border border-warning-border text-warning rounded-xl">
            <Inbox size={20} aria-hidden="true" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-ink-2 uppercase tracking-wider">Pending Review</p>
            <p className="text-xl font-extrabold text-ink mt-0.5">{campaigns.pending.length}</p>
          </div>
        </div>

        <div className="bg-paper-2-glass backdrop-blur border border-rule rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-success-bg border border-success-border text-success rounded-xl">
            <CheckCircle size={20} aria-hidden="true" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-ink-2 uppercase tracking-wider">Approved Pools</p>
            <p className="text-xl font-extrabold text-ink mt-0.5">
              {campaigns.all.filter(c => c.status === 'approved').length}
            </p>
          </div>
        </div>

        <div className="bg-paper-2-glass backdrop-blur border border-rule rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-accent-bg border border-rule-strong text-accent rounded-xl">
            <BarChart2 size={20} aria-hidden="true" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-ink-2 uppercase tracking-wider">Total Submissions</p>
            <p className="text-xl font-extrabold text-ink mt-0.5">{campaigns.all.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-paper-2-glass backdrop-blur border border-rule rounded-xl overflow-hidden shadow-sm">
        <div className="border-b border-rule bg-paper-3-glass backdrop-blur-sm px-6">
          <nav className="flex gap-6" role="tablist" aria-label="Campaign Administration Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-bold text-xs transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-ink-2 hover:text-ink'
                }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === tab.id
                    ? 'bg-accent-bg text-accent'
                    : 'bg-paper-3 text-ink-2'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div 
          className="p-6"
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          {getCurrentCampaigns().length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Inbox className="w-12 h-12 text-ink-2 opacity-35 mx-auto" aria-hidden="true" />
              <h3 className="text-sm font-bold text-ink">No campaigns found</h3>
              <p className="text-xs text-ink-2 max-w-xs mx-auto">
                {activeTab === 'pending' && 'All submissions have been audited.'}
                {activeTab === 'rejected' && 'No rejected campaigns are on file.'}
                {activeTab === 'all' && 'No campaign records available.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {getCurrentCampaigns().map((campaign) => 
                renderCampaign(campaign, activeTab === 'all')
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCampaignManager;