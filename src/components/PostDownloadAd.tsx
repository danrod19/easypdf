/**
 * @deprecated Integrado em SuccessAction (bloco único pós-sucesso).
 * Mantido para imports legados — não renderiza nada.
 */
import type { ToolName } from '../data/toolNames';

type PostDownloadAdProps = {
  toolName?: ToolName | string;
};

export function PostDownloadAd(_props: PostDownloadAdProps) {
  return null;
}
