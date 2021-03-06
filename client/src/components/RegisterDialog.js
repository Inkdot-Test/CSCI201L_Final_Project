import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CssBaseline, TextField, Button, Container, Dialog } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 350
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  button: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const mapDispatchToProps = dispatch => ({
  onLoginClick: openLogin => dispatch({ type: 'TOGGLE_LOGIN', openLogin }),
  onRegisterClick: openRegister => dispatch({ type: 'TOGGLE_REGISTER', openRegister }),
  onLogIn: username => dispatch({ type: 'USER_LOGIN', username })
});

function RegisterDialog({ openRegister, onRegisterClick, onLogIn, enqueueSnackbar, onLoginClick }) {
  const [values, setValues] = React.useState({ username: '', password: '', confirmation: '' });
  const [errorMsg, setErrorMsg] = React.useState('');
  const classes = useStyles();

  const handleRegisterClose = () => {
    onRegisterClick(false);
  };

  const handleLoginOpen = () => {
    onRegisterClick(false);
    onLoginClick(true);
  };

  const handleValueChange = event => {
    const { name, value } = event.target;
    setValues(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRegisterSubmit = async () => {
    console.log(values);
    axios
      .get('/api/register', {
        params: {
          username: values.username,
          password: values.password,
          confirmation: values.confirmation
        }
      })
      .then(function({ data }) {
        if (data.type === 'error') {
          setErrorMsg(data.message);
        } else if (data.type === 'ok') {
          onLogIn(values.username);
          setValues({ username: '', password: '', confirmation: '' });
          setErrorMsg('');
          handleRegisterClose();
          enqueueSnackbar('Successfully log in!', {
            variant: 'success',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            }
          });
        }
      });
  };

  return (
    <Dialog aria-labelledby="simple-dialog-title" open={openRegister} onClose={handleRegisterClose}>
      <Container component="main">
        <CssBaseline />
        <div className={classes.paper}>
          <img src="img/logo.png" alt="Logo" width="183" height="46" />
          <br />
          <TextField
            error={Boolean(errorMsg)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            value={values.username}
            onChange={handleValueChange}
            autoFocus
          />
          <TextField
            error={Boolean(errorMsg)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
            value={values.password}
            onChange={handleValueChange}
            type="password"
          />
          <TextField
            error={Boolean(errorMsg)}
            helperText={errorMsg}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            name="confirmation"
            value={values.confirmation}
            onChange={handleValueChange}
            type="password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleRegisterSubmit}
          >
            Sign Up
          </Button>
          <Button fullWidth className={classes.button} onClick={handleLoginOpen}>
            Go Back To Sing In
          </Button>
        </div>
      </Container>
    </Dialog>
  );
}

RegisterDialog.propTypes = {
  openRegister: PropTypes.bool.isRequired,
  onRegisterClick: PropTypes.func.isRequired,
  onLogIn: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  onLoginClick: PropTypes.func.isRequired
};

export default connect(
  state => state.tabsControl,
  mapDispatchToProps
)(withSnackbar(RegisterDialog));
