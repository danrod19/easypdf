import { useCallback } from 'react';
import {
  validateIncomingFiles,
  type FileValidationResult,
  type ValidationProfile,
} from '../lib/fileValidation';
import type { ToolName } from '../data/toolNames';

export type FileIntakeResult =
  | { ok: true; files: File[] }
  | { ok: false; message: string };

/**
 * Gate de upload reutilizável: tamanho, quantidade, páginas (quando aplicável) + GA4 file_rejected.
 */
export function useFileIntake(
  toolName: ToolName,
  profile: ValidationProfile
) {
  return useCallback(
    async (
      incoming: File[],
      existingFiles: File[] = []
    ): Promise<FileIntakeResult> => {
      const result: FileValidationResult = await validateIncomingFiles(
        incoming,
        { toolName, profile, existingFiles }
      );
      if (!result.ok) {
        return { ok: false, message: result.message };
      }
      return { ok: true, files: result.files };
    },
    [toolName, profile]
  );
}
