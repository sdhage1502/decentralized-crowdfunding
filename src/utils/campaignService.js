import { doc, getDoc, updateDoc, increment, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Fetch campaign data by ID.
 */
export const fetchCampaignById = async (id) => {
  const docRef = doc(db, "campaigns", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    throw new Error("Campaign not found.");
  }

  return { ...snapshot.data(), id };
};

/**
 * Creates a new campaign submission.
 */
export const createCampaign = async (campaignData) => {
  try {
    const payload = {
      ...campaignData,
      amount: parseFloat(campaignData.amount),
      status: "pending",
      createdAt: serverTimestamp(),
      dateCreated: new Date().toISOString(),
      raised: 0,
      collected: 0,
      donors: 0,
      contributors: 0,
      isActive: false,
      submissionTimestamp: Date.now()
    };

    const docRef = await addDoc(collection(db, "campaigns"), payload);
    return docRef.id;
  } catch (error) {
    console.error("Error creating campaign document:", error);
    throw new Error("Failed to create campaign. Please try again later.");
  }
};

/**
 * Atomically update collected amount and contributor count using Firestore increment().
 * This prevents race conditions when multiple contributions happen concurrently.
 * Both `collected` and `raised` are kept in sync so admin panel and public dashboard
 * always read the same value.
 */
export const updateCampaignStats = async (id, amount) => {
  const docRef = doc(db, "campaigns", id);

  await updateDoc(docRef, {
    collected: increment(amount),
    raised: increment(amount),      // keep admin panel field in sync
    contributors: increment(1),
  });

  // Return the latest snapshot so the caller can update local state
  const updated = await getDoc(docRef);
  return { ...updated.data(), id };
};
