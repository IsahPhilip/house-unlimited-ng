import { Property, BlogArticle } from '../types';

// --- Utility Functions ---

export const handleShare = async (property: Property | BlogArticle) => {
  const isBlog = 'category' in property && !('beds' in property);
  const title = isBlog ? (property as BlogArticle).title : (property as Property).title;
  const text = isBlog ? `Check out this interesting article: ${title}` : `I found this amazing property at ${(property as Property).address} for ${(property as Property).price}. Check it out!`;
  
  const shareData = {
    title: `${title} on Real Estate.`,
    text: text,
    url: `${window.location.origin}${isBlog ? '/blog' : '/property'}?${isBlog ? 'blogId' : 'id'}=${property.id}`
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
      alert('Link copied to clipboard!');
    }
  } catch (err) {
    if ((err as Error).name !== 'AbortError') {
      console.error('Error sharing:', err);
    }
  }
};
