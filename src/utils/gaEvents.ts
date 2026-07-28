import { logEvent } from './analytics';
import type { MonetizationPosition, ToolName } from '../data/toolNames';

/** Nomes exatos dos eventos GA4 (snake_case). */
export const GA_EVENTS = {
  TOOL_VIEW: 'tool_view',
  FILE_UPLOADED: 'file_uploaded',
  FILE_REJECTED: 'file_rejected',
  PROCESS_STARTED: 'process_started',
  PROCESS_COMPLETED: 'process_completed',
  PREVIEW_OPENED: 'preview_opened',
  FILE_DOWNLOAD: 'file_download',
  AFFILIATE_CLICK: 'affiliate_click',
  DONATION_CLICK: 'donation_click',
} as const;

export type GaEventName = (typeof GA_EVENTS)[keyof typeof GA_EVENTS];

function roundMb(bytes: number): number {
  return Math.round((bytes / (1024 * 1024)) * 100) / 100;
}

function detectFileType(files: File[]): string {
  const types = new Set(
    files.map((f) => {
      if (f.type) return f.type;
      const ext = f.name.split('.').pop()?.toLowerCase();
      return ext ? `.${ext}` : 'unknown';
    })
  );
  if (types.size === 1) return [...types][0]!;
  if (types.size > 1) return 'mixed';
  return 'unknown';
}

export function trackToolView(toolName: ToolName | string): void {
  logEvent(GA_EVENTS.TOOL_VIEW, { tool_name: toolName });
}

export function trackFileUploaded(
  toolName: ToolName | string,
  files: File[]
): void {
  if (!files.length) return;
  const totalBytes = files.reduce((sum, f) => sum + (f.size || 0), 0);
  logEvent(GA_EVENTS.FILE_UPLOADED, {
    tool_name: toolName,
    file_type: detectFileType(files),
    file_size_mb: roundMb(totalBytes),
    file_count: files.length,
  });
}

export type FileRejectedParams = {
  toolName: ToolName | string;
  reason:
    | 'file_too_large'
    | 'total_size_too_large'
    | 'too_many_files'
    | 'too_many_pages'
    | 'invalid_type'
    | string;
  fileSizeMb?: number;
  pageCount?: number;
};

export function trackFileRejected({
  toolName,
  reason,
  fileSizeMb,
  pageCount,
}: FileRejectedParams): void {
  logEvent(GA_EVENTS.FILE_REJECTED, {
    tool_name: toolName,
    reason,
    ...(fileSizeMb !== undefined ? { file_size_mb: fileSizeMb } : {}),
    ...(pageCount !== undefined ? { page_count: pageCount } : {}),
  });
}

export function trackProcessStarted(
  toolName: ToolName | string,
  fileCount: number
): void {
  logEvent(GA_EVENTS.PROCESS_STARTED, {
    tool_name: toolName,
    file_count: fileCount,
  });
}

export function trackProcessCompleted(
  toolName: ToolName | string,
  success: boolean,
  durationMs: number
): void {
  logEvent(GA_EVENTS.PROCESS_COMPLETED, {
    tool_name: toolName,
    success,
    duration_ms: Math.max(0, Math.round(durationMs)),
  });
}

export function trackPreviewOpened(toolName: ToolName | string): void {
  logEvent(GA_EVENTS.PREVIEW_OPENED, { tool_name: toolName });
}

export function trackFileDownload(
  toolName: ToolName | string,
  fileName: string
): void {
  logEvent(GA_EVENTS.FILE_DOWNLOAD, {
    tool_name: toolName,
    file_name: fileName,
  });
}

export type AffiliateClickParams = {
  toolName?: ToolName | string;
  affiliateNetwork: string;
  affiliateProduct: string;
  position: MonetizationPosition | string;
};

export function trackAffiliateClick({
  toolName = 'unknown',
  affiliateNetwork,
  affiliateProduct,
  position,
}: AffiliateClickParams): void {
  logEvent(GA_EVENTS.AFFILIATE_CLICK, {
    tool_name: toolName,
    affiliate_network: affiliateNetwork,
    affiliate_product: affiliateProduct,
    position,
  });
}

export function trackDonationClick(
  toolName: ToolName | string = 'unknown',
  position: MonetizationPosition | string = 'success_modal'
): void {
  logEvent(GA_EVENTS.DONATION_CLICK, {
    tool_name: toolName,
    position,
  });
}
