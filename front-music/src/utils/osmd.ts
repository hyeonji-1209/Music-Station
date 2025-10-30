export const OSMD_CONFIG = {
  autoResize: false,
  backend: 'svg' as const,
  drawTitle: false,
  drawSubtitle: false,
  drawComposer: false,
  drawCredits: false,
  drawingParameters: 'compact' as const,
  pageFormat: 'A4' as const,
  pageWidth: 800,
  pageHeight: 600,
};

export const ADMIN_OSMD_CONFIG = {
  ...OSMD_CONFIG,
  drawTitle: true,
};
