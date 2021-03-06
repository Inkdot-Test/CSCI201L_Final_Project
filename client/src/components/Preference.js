import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import clsx from 'clsx';
import MaterialTable from 'material-table';
import { makeStyles } from '@material-ui/core/styles';
import { TimePicker } from '@material-ui/pickers';
import {
  TextField,
  InputAdornment,
  Button,
  Chip,
  Slider,
  Typography,
  Paper,
  Grid
} from '@material-ui/core';
import { parseStateToTime, parseTimeToState } from '../utils';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  fixedHeight1: {
    height: 250,
    marginBottom: theme.spacing(2)
  },
  fixedHeight2: {
    height: 193
  }
}));

const mapDispatchToProps = dispatch => ({
  onTimeChange: (name, time) => dispatch({ type: 'SET_TIME', name, time }),
  onWeightChange: (name, weight) => dispatch({ type: 'SET_WEIGHT', name, weight }),
  onAddNewReserved: newReserved => dispatch({ type: 'ADD_NEW_RESERVED', newReserved }),
  onClearReserved: () => dispatch({ type: 'CLEAR_RESERVED' })
});

function Preference({
  early,
  late,
  breaks,
  reserved,
  onTimeChange,
  onWeightChange,
  onAddNewReserved,
  onClearReserved
}) {
  const [newReserved, setNewReserved] = React.useState({
    start: 690,
    end: 750,
    length: 45,
    weight: 50
  });

  const classes = useStyles();
  const fixedHeightPaper1 = clsx(classes.paper, classes.fixedHeight1);
  const fixedHeightPaper2 = clsx(classes.paper, classes.fixedHeight2);

  const handleEarlyTimeChange = date => {
    onTimeChange('early', parseTimeToState(date));
  };

  const handleEarlyWeightChange = (event, value) => {
    onWeightChange('early', value);
  };

  const handleLateTimeChange = date => {
    onTimeChange('late', parseTimeToState(date));
  };

  const handleLateWeightChange = (event, value) => {
    onWeightChange('late', value);
  };

  const handleBreaksTimeChange = event => {
    onTimeChange('breaks', parseInt(event.target.value, 10));
  };

  const handleBreaksWeightChange = (event, value) => {
    onWeightChange('breaks', value);
  };

  const handleNewReservedStartChange = date => {
    setNewReserved(prevState => ({ ...prevState, start: parseTimeToState(date) }));
  };

  const handleNewReservedEndChange = date => {
    setNewReserved(prevState => ({ ...prevState, end: parseTimeToState(date) }));
  };

  const handleNewReservedLengthChange = event => {
    setNewReserved(prevState => ({ ...prevState, length: parseInt(event.target.value, 10) }));
  };

  const handleNewReservedWeightChange = (event, value) => {
    setNewReserved(prevState => ({ ...prevState, weight: value }));
  };

  const handleAddNewReserved = () => {
    onAddNewReserved(newReserved);
  };

  const handleClearReserved = () => {
    onClearReserved();
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={6}>
        <Grid container spacing={3} direction="column">
          <Grid item xs={12}>
            <Paper className={fixedHeightPaper2}>
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <Typography component="h2" variant="h6" gutterBottom>
                    I hate getting up early.
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Chip color="primary" label="No" />
                    </Grid>
                    <Grid item xs>
                      <Slider
                        id="early"
                        defaultValue={early.weight}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={0}
                        max={100}
                        onChangeCommitted={handleEarlyWeightChange}
                      />
                    </Grid>
                    <Grid item>
                      <Chip color="primary" label="Yes" />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Typography component="h2" variant="h6" gutterBottom>
                        How early is too early?
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <TimePicker
                        inputProps={{ style: { textAlign: 'center' } }}
                        value={parseStateToTime(early.time)}
                        onChange={handleEarlyTimeChange}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={fixedHeightPaper2}>
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <Typography component="h2" variant="h6" gutterBottom>
                    I hate getting home late.
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Chip color="primary" label="No" />
                    </Grid>
                    <Grid item xs>
                      <Slider
                        defaultValue={late.weight}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={0}
                        max={100}
                        onChangeCommitted={handleLateWeightChange}
                      />
                    </Grid>
                    <Grid item>
                      <Chip color="primary" label="Yes" />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Typography component="h2" variant="h6" gutterBottom>
                        How late is too late?
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <TimePicker
                        inputProps={{ style: { textAlign: 'center' } }}
                        value={parseStateToTime(late.time)}
                        onChange={handleLateTimeChange}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={fixedHeightPaper2}>
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <Typography component="h2" variant="h6" gutterBottom>
                    I hate long breaks between classes.
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Chip color="primary" label="No" />
                    </Grid>
                    <Grid item xs>
                      <Slider
                        defaultValue={breaks.weight}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={0}
                        max={100}
                        onChangeCommitted={handleBreaksWeightChange}
                      />
                    </Grid>
                    <Grid item>
                      <Chip color="primary" label="Yes" />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Typography component="h2" variant="h6" gutterBottom>
                        How long is too long?
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        type="number"
                        InputLabelProps={{
                          shrink: true
                        }}
                        margin="none"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">Mins</InputAdornment>
                        }}
                        onChange={handleBreaksTimeChange}
                        defaultValue={breaks.time}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Paper className={fixedHeightPaper1}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <Typography component="h2" variant="h6" gutterBottom>
                I need reserved breaks.
              </Typography>
            </Grid>
            <Grid item>
              <Grid container spacing={2}>
                <Grid item>
                  <Chip color="primary" label="From" />
                </Grid>
                <Grid item xs={2}>
                  <TimePicker
                    inputProps={{ style: { textAlign: 'center' } }}
                    value={parseStateToTime(newReserved.start)}
                    onChange={handleNewReservedStartChange}
                  />
                </Grid>
                <Grid item>
                  <Chip color="primary" label="To" />
                </Grid>
                <Grid item xs={2}>
                  <TimePicker
                    inputProps={{ style: { textAlign: 'center' } }}
                    value={parseStateToTime(newReserved.end)}
                    onChange={handleNewReservedEndChange}
                  />
                </Grid>
                <Grid item>
                  <Chip color="primary" label="For at least" />
                </Grid>
                <Grid item>
                  <TextField
                    style={{ width: 90 }}
                    type="number"
                    InputLabelProps={{
                      shrink: true
                    }}
                    margin="none"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">mins</InputAdornment>
                    }}
                    onChange={handleNewReservedLengthChange}
                    defaultValue={newReserved.length}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container spacing={2}>
                <Grid item>
                  <Typography component="h2" variant="h6" gutterBottom>
                    Don&apos;t care
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Slider
                    defaultValue={newReserved.weight}
                    valueLabelDisplay="auto"
                    step={10}
                    marks
                    min={0}
                    max={100}
                    onChangeCommitted={handleNewReservedWeightChange}
                  />
                </Grid>
                <Grid item>
                  <Typography component="h2" variant="h6" gutterBottom>
                    I mean it
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={handleAddNewReserved}
                  >
                    Add
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={handleClearReserved}
                  >
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        <MaterialTable
          data={reserved}
          columns={[
            {
              title: 'Start',
              field: 'start',
              render: rowData => parseStateToTime(rowData.start).format('h:mm a')
            },
            {
              title: 'End',
              field: 'end',
              render: rowData => parseStateToTime(rowData.end).format('h:mm a')
            },
            { title: 'Length (mins)', field: 'length' },
            { title: 'Weight', field: 'weight' }
          ]}
          options={{
            search: false,
            sorting: false,
            selection: false,
            toolbar: false,
            pageSizeOptions: [],
            pageSize: 7,
            padding: 'dense'
          }}
        />
      </Grid>
    </Grid>
  );
}

Preference.propTypes = {
  early: PropTypes.object.isRequired,
  late: PropTypes.object.isRequired,
  breaks: PropTypes.object.isRequired,
  reserved: PropTypes.array.isRequired,
  onWeightChange: PropTypes.func.isRequired,
  onTimeChange: PropTypes.func.isRequired,
  onAddNewReserved: PropTypes.func.isRequired,
  onClearReserved: PropTypes.func.isRequired
};

export default connect(state => state.preferenceControl, mapDispatchToProps)(Preference);
