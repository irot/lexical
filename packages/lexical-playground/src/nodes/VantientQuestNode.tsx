/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  ElementFormatType,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  Spread,
} from 'lexical';

import {
  DecoratorBlockNode,
  SerializedDecoratorBlockNode,
} from '@lexical/react/LexicalDecoratorBlockNode';
import * as React from 'react';

import VantientQuestComponent from './VantientQuestComponent';

function convertVantientQuestElement(
  domNode: HTMLElement,
): DOMConversionOutput | null {
  const questID = domNode.getAttribute('data-lexical-vantient-quest-id');
  if (questID) {
    const node = $createVantientQuestNode(questID);
    return {node};
  }
  return null;
}

export type SerializedVantientQuestNode = Spread<
  {questID: string},
  SerializedDecoratorBlockNode
>;

export class VantientQuestNode extends DecoratorBlockNode {
  __id: string;

  static getType(): string {
    return 'vantient-quest';
  }

  static clone(node: VantientQuestNode): VantientQuestNode {
    return new VantientQuestNode(node.__id, node.__format, node.__key);
  }

  static importJSON(
    serializedNode: SerializedVantientQuestNode,
  ): VantientQuestNode {
    const node = $createVantientQuestNode(serializedNode.questID);
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON(): SerializedVantientQuestNode {
    return {
      ...super.exportJSON(),
      questID: this.getId(),
      type: 'vantient-quest',
      version: 1,
    };
  }

  static importDOM(): DOMConversionMap<HTMLDivElement> | null {
    return {
      div: (domNode: HTMLDivElement) => {
        if (!domNode.hasAttribute('data-lexical-vantient-quest-id')) {
          return null;
        }
        return {
          conversion: convertVantientQuestElement,
          priority: 1,
        };
      },
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div');
    element.setAttribute('data-lexical-vantient-quest-id', this.__id);
    const text = document.createTextNode(this.getTextContent());
    element.append(text);
    return {element};
  }

  constructor(id: string, format?: ElementFormatType, key?: NodeKey) {
    super(format, key);
    this.__id = id;
  }

  getId(): string {
    return this.__id;
  }

  getTextContent(
    _includeInert?: boolean | undefined,
    _includeDirectionless?: false | undefined,
  ): string {
    return `https://cmty.space/quest/${this.__id}`;
  }

  decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element {
    const embedBlockTheme = config.theme.embedBlock || {};
    const className = {
      base: embedBlockTheme.base || '',
      focus: embedBlockTheme.focus || '',
    };
    return (
      <VantientQuestComponent
        className={className}
        format={this.__format}
        nodeKey={this.getKey()}
        questID={this.__id}
      />
    );
  }
}

export function $createVantientQuestNode(questID: string): VantientQuestNode {
  return new VantientQuestNode(questID);
}

export function $isVantientQuestNode(
  node: VantientQuestNode | LexicalNode | null | undefined,
): node is VantientQuestNode {
  return node instanceof VantientQuestNode;
}
