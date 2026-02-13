export interface StoryAssets {
  illustration: string;
  coloring: string;
}

export function getStoryAssets(storyNumber: number): StoryAssets {
  const num = storyNumber.toString().padStart(2, '0');
  return {
    illustration: `/assets/generated/story-${num}-illustration.dim_1024x1024.png`,
    coloring: `/assets/generated/story-${num}-coloring.dim_1024x1024.png`,
  };
}

export function getCoverAsset(): string {
  return '/assets/generated/little-light-cover.dim_1600x2400.png';
}
