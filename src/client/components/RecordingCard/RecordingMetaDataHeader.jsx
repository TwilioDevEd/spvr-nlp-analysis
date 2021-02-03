/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { secondsToTimeString, formatDate } from '../../utils/stringHelpers';

const useStyles = makeStyles({
  root: {
    background: '#f5f5f5',
    padding: '1em',
    textAlign: 'center',
  },
  greenBg: {
    backgroundColor: '#4caf50',
  },
  blueBg: {
    backgroundColor: '#2196f3',
  },
  orangeBg: {
    backgroundColor: '#ff9800',
  },
});

const RecordingMetaDataHeader = ({ callDuration, tone, dateCreated }) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item xs={4}>
        <Card className={classes.greenBg}>
          <CardContent>
            <Typography color="textPrimary" variant="overline" gutterBottom>
              Call Duration
            </Typography>
            <Typography variant="h5" component="h2" color="textSecondary">
              {secondsToTimeString(callDuration)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card className={classes.blueBg}>
          <CardContent>
            <Typography color="textPrimary" variant="overline" gutterBottom>
              Tone Sentiment
            </Typography>
            <Typography variant="h5" component="h2" color="textSecondary">
              {tone}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card className={classes.orangeBg}>
          <CardContent>
            <Typography color="textPrimary" variant="overline" gutterBottom>
              Date Created
            </Typography>
            <Typography variant="h5" component="h2" color="textSecondary">
              {formatDate(dateCreated)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default RecordingMetaDataHeader;
