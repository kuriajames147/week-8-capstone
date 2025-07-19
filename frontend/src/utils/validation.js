export const validateRegister = (values) => {
  const errors = {};
  if (!values.username) errors.username = 'Username is required';
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Email is invalid';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  return errors;
};

export const validateTask = (values) => {
  const errors = {};
  if (!values.title) errors.title = 'Title is required';
  if (!values.team) errors.team = 'Team is required';
  return errors;
};