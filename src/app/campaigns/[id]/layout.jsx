import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';

/**
 * Dynamic metadata for campaign pages — generates Open Graph and
 * Twitter Card meta tags for rich social sharing previews.
 */
export async function generateMetadata({ params }) {
  const { id } = await params;
  
  const defaults = {
    title: 'Campaign | DFund',
    description: 'Back this campaign on DFund — Ethereum-powered decentralized crowdfunding.',
  };

  try {
    const docRef = doc(db, 'campaigns', id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) return defaults;

    const campaign = snapshot.data();
    const title = `${campaign.title || 'Campaign'} | DFund`;
    const description = campaign.description
      ? campaign.description.slice(0, 160)
      : defaults.description;
    const image = campaign.image || '/og-default.png';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: image, width: 1200, height: 630 }],
        type: 'website',
        siteName: 'DFund',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
    };
  } catch (error) {
    console.error('Error generating campaign metadata:', error);
    return defaults;
  }
}

export default function CampaignLayout({ children }) {
  return children;
}
