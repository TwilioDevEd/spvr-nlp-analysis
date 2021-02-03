import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, TextField } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
    margin: '5em 0 5em 0',
  },
  textField: {
    width: '50%',
  },
  button: {
    height: '100%',
  },
}));

const InputForm = ({ label, submitText, onSubmit }) => {
  const { handleSubmit, control } = useForm();

  const processInput = (input) => {
    onSubmit(input);
  };

  const classes = useStyles();

  return (
    <form className={classes.root} onSubmit={handleSubmit(processInput)}>
      <Grid container>
        <Grid item xs={12}>
          <Controller
            render={(props) => (
              <TextField
                {...props}
                className={classes.textField}
                label={label}
                variant="outlined"
              />
            )}
            name="input"
            control={control}
            defaultValue=""
          />
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
            type="submit"
          >
            {submitText}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default InputForm;
