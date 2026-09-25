import { calculateCredits } from '@/app/lib/calculateCredits';

export const generateTooltip = (credits: number): string => {
  // Whole operations only; a missing or zero cost counts as 0
  const {
    favicon: faviconCount,
    images: optimizationCount,
    backgroundRemoval: backgroundRemovalCount,
  } = calculateCredits(credits);

  return `You can export ${faviconCount} archive${faviconCount !== 1 ? 's' : ''} with favicon or ${optimizationCount} archives with images or remove background from ${backgroundRemovalCount} image${backgroundRemovalCount !== 1 ? 's' : ''}.`;
};
