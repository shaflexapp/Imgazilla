const IMAGE_CREDITS_COST = process.env.IMAGE_CREDITS_COST;
const FAVICON_ARCHIVE_CREDITS_COST = process.env.FAVICON_ARCHIVE_CREDITS_COST;
const BACKGROUND_REMOVAL_COST = process.env.BACKGROUND_REMOVAL_COST;

// Each operation has a flat cost, so only whole operations are affordable
const countOperations = (credits: number, cost: string): number => {
  const operationCost = parseInt(cost);

  if (!Number.isFinite(credits) || !(operationCost > 0)) {
    return 0;
  }

  return Math.max(0, Math.floor(credits / operationCost));
};

export const calculateCredits = (credits: string | number) => {
  const balance = parseInt(String(credits));

  const faviconArchNumb = countOperations(
    balance,
    FAVICON_ARCHIVE_CREDITS_COST,
  );
  const imageNumb = countOperations(balance, IMAGE_CREDITS_COST);
  const backgroundRemovalNumb = countOperations(
    balance,
    BACKGROUND_REMOVAL_COST,
  );

  return {
    favicon: faviconArchNumb,
    images: imageNumb,
    backgroundRemoval: backgroundRemovalNumb,
  };
};
