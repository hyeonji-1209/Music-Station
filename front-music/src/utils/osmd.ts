export const OSMD_CONFIG = {
  autoResize: false,
  backend: 'svg' as const,
  drawTitle: false,
  drawSubtitle: false,
  drawComposer: false,
  drawCredits: false,
  drawingParameters: 'compact' as const,
};

export const ADMIN_OSMD_CONFIG = {
  ...OSMD_CONFIG,
  drawTitle: true,
};
