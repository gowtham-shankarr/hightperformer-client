import React, { useEffect, useState } from 'react';
import { ActionTypes } from '../utils';
import TextField from '@mui/material/TextField';
import { format } from 'date-fns';

export default function DatePickerCell({
  initialValue,
  columnId,
  rowIndex,
  dataDispatch,
}) {
  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'dd-MM-yyyy');
  };

  const [selectedDate, setSelectedDate] = useState(
    initialValue ? formatDate(initialValue) : ''
  );

  const handleDateChange = (event) => {
    const { value } = event.target;
    setSelectedDate(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dataDispatch({
      type: ActionTypes.UPDATE_CELL,
      columnId,
      rowIndex,
      value: selectedDate,
    });
  };

  useEffect(() => {
    if (initialValue) {
      setSelectedDate(formatDate(initialValue));
    }
  }, [initialValue]);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <TextField
          label="Select date"
          value={selectedDate}
          readOnly
        />
        {/* <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="date-picker"
        /> */}
        <input
  type="date"
  value={selectedDate}
  onChange={handleDateChange}
  className="date-picker"
  style={{ color: "#fff" }}
/>
      </div>
    </form>
  );
}
