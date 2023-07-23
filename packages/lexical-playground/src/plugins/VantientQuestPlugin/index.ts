/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$insertNodeToNearestRoot} from '@lexical/utils';
import {COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand} from 'lexical';
import {useEffect} from 'react';

import {
  $createVantientQuestNode,
  VantientQuestNode,
} from '../../nodes/VantientQuestNode';

export const INSERT_VANTIENT_QUEST_COMMAND: LexicalCommand<string> =
  createCommand('INSERT_VANTIENT_QUEST_COMMAND');

export default function VantientQuestPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([VantientQuestNode])) {
      throw new Error(
        'VantientQuestPlugin: VantientQuestNode not registered on editor',
      );
    }

    return editor.registerCommand<string>(
      INSERT_VANTIENT_QUEST_COMMAND,
      (payload) => {
        const vantientQuestNode = $createVantientQuestNode(payload);
        $insertNodeToNearestRoot(vantientQuestNode);

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
