/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import './VantientQuestNode.css';

import {BlockWithAlignableContents} from '@lexical/react/LexicalBlockWithAlignableContents';
import {ElementFormatType, NodeKey} from 'packages/lexical/src';
import * as React from 'react';
import {Suspense, useCallback, useEffect, useMemo, useState} from 'react';

const PROXY_URL = 'http://localhost:1236/quest';

interface QuestData {
  quest: {
    coverImageUrl?: string;
    description?: {
      text: string;
    };
    endsAt?: string;
    title: string;
  };
}

interface QuestDetail {
  coverImageUrl?: string;
  description?: string;
  period?: string;
  title?: string;
}

type VantientQuestProps = Readonly<{
  className: Readonly<{
    base: string;
    focus: string;
  }>;
  format: ElementFormatType | null;
  nodeKey: NodeKey;
  questID: string;
}>;

function VantientQuestComponent({
  className,
  format,
  nodeKey,
  questID,
}: VantientQuestProps) {
  const [questData, setQuestData] = useState<QuestData>();

  const loadQuest = useCallback(async (): Promise<void> => {
    try {
      const headers = new Headers({
        'Content-Type': 'application/json',
      });
      const res = await fetch(PROXY_URL, {
        body: JSON.stringify({_k: `Quest/${questID}`}),
        headers,
        method: 'POST',
      });
      const jsonData = await res.json();
      setQuestData(jsonData.data);
    } catch {
      console.error(`Failed to fetch quest: ${questID}`);
    }
  }, [questID]);

  const details: QuestDetail = useMemo(() => {
    const detailObj: QuestDetail = {};

    if (questData?.quest) {
      const {
        quest: {coverImageUrl, description, endsAt, title},
      } = questData;

      detailObj.coverImageUrl = coverImageUrl;
      detailObj.description = description?.text;

      // Note: no startsAt?
      if (endsAt) {
        const endDate = new Date(endsAt);
        const dtf = Intl.DateTimeFormat('en-GB', {
          day: 'numeric',
          month: 'short',
        });
        detailObj.period = `Ends ${dtf
          .formatToParts(endDate)
          .flatMap((part) => part.value)
          .join('')}`;
      }
      detailObj.title = title;
    }

    return detailObj;
  }, [questData]);

  useEffect(() => {
    if (questID) {
      loadQuest();
    }
  }, [loadQuest, questID]);

  return (
    <BlockWithAlignableContents
      className={className}
      format={format}
      nodeKey={nodeKey}>
      <Suspense fallback={<span>Quest loading...</span>}>
        <article className="VantientQuest__card">
          {details.coverImageUrl && (
            <Suspense fallback={<span>Image loading...</span>}>
              <figure className="VantientQuest__coverImage">
                <img src={details.coverImageUrl} alt="" />
              </figure>
            </Suspense>
          )}
          <div className="VantientQuest__icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentcolor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 8m0 1a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1z" />
              <path d="M12 8l0 13" />
              <path d="M19 12v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7" />
              <path d="M7.5 8a2.5 2.5 0 0 1 0 -5a4.8 8 0 0 1 4.5 5a4.8 8 0 0 1 4.5 -5a2.5 2.5 0 0 1 0 5" />
            </svg>
          </div>
          <div className="VantientQuest__detail">
            <h4>{details.title}</h4>
            <p>{details.description}</p>
          </div>
          <div className="VantientQuest__cta">
            <button className="VantientQuest__button">
              <span>Join Quest</span>
            </button>
          </div>
          <footer className="VantientQuest__period">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentcolor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 5m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
              <path d="M16 3l0 4" />
              <path d="M8 3l0 4" />
              <path d="M4 11l16 0" />
              <path d="M8 15h2v2h-2z" />
            </svg>
            <span>{details.period}</span>
          </footer>
        </article>
      </Suspense>
    </BlockWithAlignableContents>
  );
}

export default VantientQuestComponent;
