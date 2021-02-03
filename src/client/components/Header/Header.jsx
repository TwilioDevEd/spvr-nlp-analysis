import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  title: {
    marginTop: '1em',
  },
});

const Header = () => {
  const classes = useStyles();

  return (
    <Grid container justify="flex-start" alignItems="flex-start">
      <Grid item xs={12}>
        <Typography
          className={classes.title}
          variant="h2"
          component="h2"
          gutterBottom
          align="center"
        >
          Customer Call Recording Analysis
        </Typography>
      </Grid>
    </Grid>
  );
};
export default Header;
