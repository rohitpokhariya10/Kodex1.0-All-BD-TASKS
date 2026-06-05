export const authModes = Object.freeze({
  LOGIN: 'login',
  REGISTER: 'register',
});

export const authValidationRules = Object.freeze({
  name: {
    minLength: 3,
    required: 'Full name is required.',
  },
  email: {
    pattern: /^\S+@\S+\.\S+$/,
    required: 'Email is required.',
  },
  password: {
    minLength: 8,
    required: 'Password is required.',
  },
});
