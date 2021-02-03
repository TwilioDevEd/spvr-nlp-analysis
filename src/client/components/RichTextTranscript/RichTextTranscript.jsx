/* eslint-disable react/prop-types */
/* eslint-disable consistent-return */
import React, { useState } from 'react';
import { convertFromHTML, ContentState, convertToRaw } from 'draft-js';
import { Decimal } from 'decimal.js';
import MUIRichTextEditor from 'mui-rte';

const rawContent = new Map();
const knowledgeBase = [
  {
    text: 'doctor',
    url: 'https://www.ucsfhealth.org/find-a-doctor',
  },
];

const isKeyword = (word, keywords) => {
  if (Object.keys(keywords).length === 0) return false;
  return Object.keys(keywords).find((key) => key === word.text);
};

const hasKnowledgeBaseEntry = (word) =>
  knowledgeBase.find((entry) => word.text === entry.text);

const styled = (word, entry) => {
  if (word.style === 'bold') {
    return `<strong>${word.text}</strong>`;
  }

  if (word.style === 'link') {
    return `<a href="${entry.url}">🔗${word.text}🔗</a>`;
  }

  return word.text;
};

const RichTextTranscript = ({ elapsedTime, transcript }) => {
  if (Object.keys(transcript).length === 0) return;

  const [markup, setMarkup] = useState('');

  const { timestamps } = transcript.alternatives[0];
  const keywords = transcript.keywords_result || {};

  Object.keys(timestamps).forEach((key) => {
    const value = timestamps[key];
    const audioPlaybackTime = new Decimal(elapsedTime);

    const word = {
      text: value[0],
      start: new Decimal(value[1]),
      stop: new Decimal(value[2]),
      style: undefined,
    };

    const isBetween =
      audioPlaybackTime.greaterThanOrEqualTo(word.start) &&
      audioPlaybackTime.lessThanOrEqualTo(word.stop);

    // Hacky
    if (isBetween) {
      word.id = `${word.text}${word.start.toString()}${word.stop.toString()}`;
      if (!rawContent.has(word.id)) {
        rawContent.set(word.id, word);

        if (isKeyword(word, keywords)) {
          word.style = 'bold';
        }

        const entry = hasKnowledgeBaseEntry(word);
        if (entry) {
          word.style = 'link';
        }

        const formatted = styled(word, entry);
        setMarkup((prevState) => `${prevState} ${formatted}`);
      }
    }
  });

  const contentHTML = convertFromHTML(markup);
  const state = ContentState.createFromBlockArray(
    contentHTML.contentBlocks,
    contentHTML.entityMap
  );
  const content = JSON.stringify(convertToRaw(state));

  return (
    <MUIRichTextEditor
      controls={['redo', 'bold', 'highlight', 'link', 'clear', 'save']}
      defaultValue={content}
    />
  );
};

export default RichTextTranscript;
