import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface EventType {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
}

export default function CalendarWithModal() {
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);
  const [open, setOpen] = React.useState(false);
  const [events, setEvents] = React.useState<EventType[]>([]);
  const [newEventTitle, setNewEventTitle] = React.useState('');

  const [startDateTime, setStartDateTime] = React.useState<Dayjs | null>(null);
  const [endDateTime, setEndDateTime] = React.useState<Dayjs | null>(null);

  const [editingEventId, setEditingEventId] = React.useState<number | null>(
    null
  );
  const [editingTitle, setEditingTitle] = React.useState('');
  const [editingStartDateTime, setEditingStartDateTime] =
    React.useState<Dayjs | null>(null);
  const [editingEndDateTime, setEditingEndDateTime] =
    React.useState<Dayjs | null>(null);

  const API_ADD_URL = 'http://localhost:3000/api/events/add';
  const API_GET_URL = 'http://localhost:3000/api/events';

  const fetchEvents = async () => {
    try {
      const res = await axios.get(API_GET_URL);
      setEvents(res.data);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  React.useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setNewEventTitle('');
    setStartDateTime(null);
    setEndDateTime(null);
    setEditingEventId(null);
    setEditingTitle('');
    setEditingStartDateTime(null);
    setEditingEndDateTime(null);
  };

  const handleDateSelect = (date: Dayjs) => {
    setSelectedDate(date);
    setOpen(true);
    resetForm();
    setStartDateTime(date.hour(9).minute(0).second(0));
    setEndDateTime(date.hour(10).minute(0).second(0));
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleAddEvent = async () => {
    if (!newEventTitle.trim() || !startDateTime || !endDateTime) return;

    if (endDateTime.isBefore(startDateTime)) {
      alert('End time cannot be before start time.');
      return;
    }

    const newEvent = {
      title: newEventTitle.trim(),
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
    };

    try {
      const res = await axios.post(API_ADD_URL, newEvent);
      setEvents((prev) => [...prev, res.data]);
      alert('Event added successfully!');
      resetForm();
      setOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          alert('This event already exists.');
        } else {
          alert('Failed to add the event. Please try again.');
        }
      } else {
        alert('Failed to add the event. Please try again.');
      }
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      await axios.delete(`${API_GET_URL}/${id}`);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      alert('Failed to delete the event. ');
    }
  };

  const handleStartEdit = (event: EventType) => {
    setEditingEventId(event.id);
    setEditingTitle(event.title);
    setEditingStartDateTime(dayjs(event.startDate));
    setEditingEndDateTime(dayjs(event.endDate));
  };

  const handleSaveEdit = async () => {
    if (
      editingEventId === null ||
      !editingTitle.trim() ||
      !editingStartDateTime ||
      !editingEndDateTime
    ) {
      return;
    }

    if (editingEndDateTime.isBefore(editingStartDateTime)) {
      alert('End time cannot be before start time.');
      return;
    }

    try {
      await axios.put(`${API_GET_URL}/${editingEventId}`, {
        title: editingTitle.trim(),
        startDate: editingStartDateTime.toISOString(),
        endDate: editingEndDateTime.toISOString(),
      });

      setEvents((prev) =>
        prev.map((e) =>
          e.id === editingEventId
            ? {
                ...e,
                title: editingTitle.trim(),
                startDate: editingStartDateTime.toISOString(),
                endDate: editingEndDateTime.toISOString(),
              }
            : e
        )
      );
      alert('Event edited successfully!');

      resetForm();
    } catch (error) {
      alert('Failed to edit the event.');
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const eventsForSelectedDate = selectedDate
    ? events.filter((e) => {
        const start = dayjs(e.startDate);
        const end = dayjs(e.endDate);
        return (
          selectedDate.isSame(start, 'day') ||
          selectedDate.isSame(end, 'day') ||
          (selectedDate.isAfter(start, 'day') &&
            selectedDate.isBefore(end, 'day'))
        );
      })
    : [];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar onChange={handleDateSelect} />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>
          Events for {selectedDate?.format('DD MMMM YYYY')}
        </DialogTitle>
        <DialogContent>
          {eventsForSelectedDate.length > 0 ? (
            <List>
              {eventsForSelectedDate.map((event) => (
                <ListItem
                  key={event.id}
                  secondaryAction={
                    <>
                      {editingEventId === event.id ? (
                        <>
                          <Button
                            onClick={handleSaveEdit}
                            size="small"
                            color="primary"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={handleCancelEdit}
                            size="small"
                            color="inherit"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => handleStartEdit(event)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </>
                  }
                >
                  {editingEventId === event.id ? (
                    <>
                      <TextField
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        size="small"
                        variant="standard"
                        autoFocus
                        fullWidth
                      />
                      <DateTimePicker
                        label="Start"
                        value={editingStartDateTime}
                        onChange={(newVal) => setEditingStartDateTime(newVal)}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth sx={{ mt: 1 }} />
                        )}
                      />
                      <DateTimePicker
                        label="End"
                        value={editingEndDateTime}
                        onChange={(newVal) => setEditingEndDateTime(newVal)}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth sx={{ mt: 1 }} />
                        )}
                      />
                    </>
                  ) : (
                    <ListItemText
                      primary={event.title}
                      secondary={`${dayjs(event.startDate).format(
                        'HH:mm'
                      )} - ${dayjs(event.endDate).format('HH:mm')}`}
                    />
                  )}
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" sx={{ mb: 2 }}>
              No events for this day
            </Typography>
          )}

          {/* Поле за наслов */}
          <TextField
            label="Event title"
            fullWidth
            variant="outlined"
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddEvent();
              }
            }}
            sx={{ mt: 2, paddingBottom: '15px' }}
          />

          <DateTimePicker
            label="Start date"
            value={startDateTime}
            onChange={(newVal) => setStartDateTime(newVal)}
            renderInput={(params) => (
              <TextField {...params} fullWidth sx={{ mt: 2 }} />
            )}
            sx={{ paddingBottom: '15px' }}
          />
          <DateTimePicker
            label="End date"
            value={endDateTime}
            onChange={(newVal) => setEndDateTime(newVal)}
            renderInput={(params) => (
              <TextField {...params} fullWidth sx={{ mt: 2 }} />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button
            onClick={handleAddEvent}
            variant="contained"
            disabled={!newEventTitle.trim() || !startDateTime || !endDateTime}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
