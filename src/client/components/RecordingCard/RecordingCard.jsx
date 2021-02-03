/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Box, Divider } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactJson from 'react-json-view';
import WaveForm from './WaveForm';
import RichTextTranscript from '../RichTextTranscript';
import RecordingMetaDataHeader from './RecordingMetaDataHeader';

const useStyles = makeStyles({
  root: {
    background: '#f5f5f5',
    padding: '1em',
    marginTop: '5em',
  },
  center: {
    textAlign: 'center',
  },
});

const RecordingCard = ({ url, title, transcript, tone, recordingMetadata }) => {
  const classes = useStyles();
  const [elapsedTime, setElapsedTime] = useState(0);

  const handleAudioProcessing = (data) => {
    setElapsedTime(data);
  };

  return (
    <Box className={classes.root}>
      <RecordingMetaDataHeader
        callDuration={recordingMetadata.duration}
        tone={tone}
        dateCreated={recordingMetadata.dateCreated}
      />
      <Card>
        <WaveForm
          className={classes.center}
          url={url}
          onAudioProcessing={handleAudioProcessing}
        />
        <CardContent>
          <Typography
            className={classes.center}
            gutterBottom
            variant="h5"
            component="h2"
          >
            {title}
          </Typography>
          {Object.keys(transcript).length === 0 ? (
            <div className={classes.center}>
              <CircularProgress />
            </div>
          ) : (
            <Grid container justify="flex-start" alignItems="flex-start">
              <Grid item xs={6}>
                <Typography
                  gutterBottom
                  variant="overline"
                  color="textSecondary"
                >
                  TRANSCRIPTION
                </Typography>
                <Divider />
                <RichTextTranscript
                  elapsedTime={elapsedTime}
                  transcript={transcript}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography
                  gutterBottom
                  variant="overline"
                  color="textSecondary"
                >
                  JSON
                </Typography>
                <Divider />
                <ReactJson
                  style={{
                    textAlign: 'left',
                  }}
                  theme="bright:inverted"
                  src={transcript}
                />
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default RecordingCard;
