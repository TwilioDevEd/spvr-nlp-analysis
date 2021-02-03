import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import RecordingCard from './components/RecordingCard';
import Header from './components/Header';
import AnalysisService from './services/AnalysisService';
import TwilioCallRecordingService from './services/TwilioCallRecordingService';
import TwilioSyncClient from './services/TwilioSyncClient';
import Waiting from './components/Waiting';

const useStyles = makeStyles({
  root: {
    margin: 'auto',
  },
  container: {
    margin: 'auto',
    maxWidth: '75%',
  },
});

const App = () => {
  const classes = useStyles();
  const [syncClient, setSyncClient] = useState(null);
  const [recordings, setRecordings] = useState(new Map());

  // Use updateMap to update recordings and refresh DOM
  const updateMap = (key, value) =>
    setRecordings(new Map(recordings.set(key, value)));

  const getAnalysis = async (url) => {
    const analysis = new AnalysisService(url);
    const results = await analysis.retrieve();
    return results;
  };

  const getRecordingMetadata = async (sid) => {
    const metadata = new TwilioCallRecordingService(sid);
    const results = await metadata.retrieve();
    return results;
  };

  const handleItemAdded = async (item) => {
    if (!recordings.has(item.key)) {
      const transcript = await getAnalysis(item.url);
      const metadata = await getRecordingMetadata(item.key);

      console.log('=====Transcript & Metadata=====');
      console.table(transcript);
      console.table(metadata);

      updateMap(item.key, {
        title: item.title,
        url: item.url,
        transcript,
        metadata,
      });
    }
  };

  useEffect(() => {
    setSyncClient(new TwilioSyncClient());
  }, []);

  useEffect(async () => {
    if (syncClient) {
      await syncClient.setEvents(handleItemAdded);
    }
  }, [syncClient]);

  return (
    <div className={classes.root}>
      <Header />
      <Grid
        className={classes.container}
        container
        direction="row-reverse"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={12}>
          {recordings.size === 0 ? (
            <Waiting />
          ) : (
            [...recordings.keys()].map((key) => (
              <RecordingCard
                key={recordings.get(key).title}
                url={recordings.get(key).url}
                title={recordings.get(key).title}
                transcript={recordings.get(key).transcript}
                tone={recordings.get(key).transcript.tones[0].tone_name}
                recordingMetadata={recordings.get(key).metadata}
              />
            ))
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default App;
