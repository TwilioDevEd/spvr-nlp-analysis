/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Box, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    marginTop: '5em',
    textAlign: 'center',
  },
  mt: {
    marginTop: '1em',
  },
});

const Waiting = () => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <CircularProgress />
      <Typography className={classes.mt} variant="body1" color="textSecondary">
        Waiting for recording.
      </Typography>
    </Box>
  );
};

export default Waiting;
