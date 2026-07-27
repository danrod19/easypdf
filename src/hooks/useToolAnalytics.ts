import { useCallback, useEffect, useRef } from 'react';
import type { ToolName } from '../data/toolNames';
import {
  trackFileDownload,
  trackFileUploaded,
  trackPreviewOpened,
  trackProcessCompleted,
  trackProcessStarted,
  trackToolView,
} from '../utils/gaEvents';

/**
 * Analytics da jornada de uma ferramenta:
 * tool_view no mount + helpers para upload/process/preview/download.
 */
export function useToolAnalytics(toolName: ToolName) {
  const viewed = useRef(false);

  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    trackToolView(toolName);
  }, [toolName]);

  const trackUpload = useCallback(
    (files: File[]) => {
      trackFileUploaded(toolName, files);
    },
    [toolName]
  );

  /** Retorna timestamp (performance.now) para calcular duration_ms. */
  const startProcess = useCallback(
    (fileCount: number): number => {
      trackProcessStarted(toolName, fileCount);
      return performance.now();
    },
    [toolName]
  );

  const endProcess = useCallback(
    (success: boolean, startedAt: number) => {
      trackProcessCompleted(
        toolName,
        success,
        performance.now() - startedAt
      );
    },
    [toolName]
  );

  const trackPreview = useCallback(() => {
    trackPreviewOpened(toolName);
  }, [toolName]);

  const trackDownload = useCallback(
    (fileName: string) => {
      trackFileDownload(toolName, fileName);
    },
    [toolName]
  );

  return {
    toolName,
    trackUpload,
    startProcess,
    endProcess,
    trackPreview,
    trackDownload,
  };
}
