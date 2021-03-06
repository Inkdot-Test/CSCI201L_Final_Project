import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import clsx from 'clsx';
import MaterialTable from 'material-table';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, Paper, Box } from '@material-ui/core/';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import {
  parseStateToCalEvents,
  parseStateToScores,
  parseStatesToGenSchedule,
  handleCalendarExport
} from '../utils';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CustomCalEvent from './CustomCalEvent';
import SaveToHistoryDialog from './SaveToHistoryDialog';

const useStyles = makeStyles(() => ({
  paper: {
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  fixedHeight: {
    height: 580
  }
}));

const mapDispatchToProps = dispatch => ({
  onRowClick: selectedScheduleID => dispatch({ type: 'SET_SELECTED_ID', selectedScheduleID }),
  onGenSchedules: schedules => dispatch({ type: 'GEN_SCHEDULES', schedules }),
  onDialogClick: openDialog => dispatch({ type: 'TOGGLE_SAVE_TO_HISTORY', openDialog })
});

function Schedule({
  courses,
  preferences,
  schedules,
  selectedScheduleID,
  onRowClick,
  onGenSchedules,
  user,
  onDialogClick
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isZoom, setIsZoom] = React.useState(false);
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const localizer = momentLocalizer(moment);

  const getSelectedCalEvents = () => {
    const selected = schedules.find(schedule => schedule.id === selectedScheduleID);
    if (selected) {
      return parseStateToCalEvents(selected.sections.filter(section => section.time !== undefined));
    }
    return [];
  };

  const handleZoomClick = () => {
    setIsZoom(!isZoom);
  };

  const handleScoresRowClick = (event, rowData) => {
    onRowClick(rowData.id);
  };

  const handleGeneSchedules = async () => {
    setIsLoading(true);
    axios
      .post('api/generate-schedule', parseStatesToGenSchedule(courses, preferences))
      .then(function({ data }) {
        console.log(data);
        setTimeout(() => {
          setIsLoading(false);
          onGenSchedules(data.results);
        }, 1000);
      });
  };

  const handleDialogOpen = () => {
    onDialogClick(true);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={4}>
        <Grid container spacing={5} direction="column">
          <Grid item xs={12}>
            <Box height={549} mb={1}>
              <MaterialTable
                isLoading={isLoading}
                data={parseStateToScores(schedules)}
                columns={[
                  { title: 'Id', field: 'id', defaultSort: 'asc' },
                  { title: 'Total', field: 'total', defaultSort: 'asc' },
                  { title: 'Early', field: 'early', defaultSort: 'asc' },
                  { title: 'Late', field: 'late', defaultSort: 'asc' },
                  { title: 'Breaks', field: 'breaks', defaultSort: 'asc' },
                  { title: 'Reserved', field: 'reserved', defaultSort: 'asc' }
                ]}
                options={{
                  search: false,
                  sorting: true,
                  selection: false,
                  pageSize: 11,
                  pageSizeOptions: [],
                  padding: 'dense',
                  rowStyle: rowData => ({
                    backgroundColor:
                      selectedScheduleID !== 0 && selectedScheduleID === rowData.id
                        ? '#EEE'
                        : '#FFF'
                  })
                }}
                title="Results"
                onRowClick={handleScoresRowClick}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button color="primary" variant="contained" fullWidth onClick={handleGeneSchedules}>
              Generate Schedules
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6} lg={8}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Paper className={fixedHeightPaper}>
              <Box id="cal">
                <Calendar
                  id="timetable"
                  localizer={localizer}
                  defaultView="work_week"
                  views={['work_week']}
                  defaultDate={new Date(moment('1880-10-06 00:00'))}
                  events={getSelectedCalEvents()}
                  style={{ maxHeight: 2000 }}
                  toolbar={false}
                  min={new Date('1880-10-06 08:00')}
                  max={new Date('1880-10-06 22:00')}
                  step={15}
                  timeslots={isZoom ? 2 : 4}
                  components={{ event: CustomCalEvent }}
                  formats={{ dayFormat: 'ddd' }}
                />
              </Box>
            </Paper>
          </Grid>
          <Grid item container spacing={5} direction="row" justify="center">
            <Grid item xs={4}>
              <Button color="primary" variant="contained" fullWidth onClick={handleZoomClick}>
                Zoom {!isZoom ? 'In' : 'Out'}
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                color="primary"
                variant="contained"
                fullWidth
                disabled={
                  !user.status ||
                  schedules.find(schedule => schedule.id === selectedScheduleID) === undefined
                }
                onClick={handleDialogOpen}
              >
                Save to History
              </Button>
              <SaveToHistoryDialog />
            </Grid>
            <Grid item xs={4}>
              <Button color="primary" variant="contained" fullWidth onClick={handleCalendarExport}>
                Export
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

Schedule.propTypes = {
  courses: PropTypes.array.isRequired,
  preferences: PropTypes.object.isRequired,
  schedules: PropTypes.array.isRequired,
  selectedScheduleID: PropTypes.number.isRequired,
  onRowClick: PropTypes.func.isRequired,
  onGenSchedules: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  onDialogClick: PropTypes.func.isRequired
};

export default connect(state => {
  const { scheduleControl, coursebinControl, preferenceControl, userControl } = state;
  return {
    ...scheduleControl,
    courses: coursebinControl.courses,
    preferences: preferenceControl,
    user: userControl
  };
}, mapDispatchToProps)(Schedule);
