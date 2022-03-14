export const validationMessages = [
  {
    control: 'title',
    rules: {
      required: 'Title is required',
    },
  },
  {
    control: 'date',
    rules: {
      required: 'Date is required',
    },
  },
  {
    control: 'time_start',
    rules: {
      required: 'Start time is required',
      timeStartIsBefore: "Start time can't be earlier than end time",
    },
  },
  {
    control: 'time_end',
    rules: {
      required: 'End time is required',
    },
  },
  {
    control: 'customer',
    rules: {
      required: 'Customer is required',
    },
  },
];
