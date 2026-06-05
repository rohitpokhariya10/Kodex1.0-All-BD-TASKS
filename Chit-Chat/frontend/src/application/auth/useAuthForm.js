import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { authModes, authValidationRules } from '../../domain/entities/auth.js';

const defaultValues = {
  name: 'Rohit Pokhariya',
  email: 'rohit@student.dev',
  password: 'frontendlayer',
};

export function useAuthForm({ onAuthenticated }) {
  const [mode, setMode] = useState(authModes.LOGIN);
  const form = useForm({
    defaultValues,
    mode: 'onChange',
  });

  const isRegister = mode === authModes.REGISTER;

  const fieldRules = useMemo(
    () => ({
      name: {
        minLength: {
          message: `Name must be at least ${authValidationRules.name.minLength} characters.`,
          value: authValidationRules.name.minLength,
        },
        required: isRegister ? authValidationRules.name.required : false,
      },
      email: {
        pattern: {
          message: 'Use a valid email address.',
          value: authValidationRules.email.pattern,
        },
        required: authValidationRules.email.required,
      },
      password: {
        minLength: {
          message: `Password must be at least ${authValidationRules.password.minLength} characters.`,
          value: authValidationRules.password.minLength,
        },
        required: authValidationRules.password.required,
      },
    }),
    [isRegister],
  );

  function switchMode(nextMode) {
    setMode(nextMode);
    form.clearErrors();
  }

  const submit = form.handleSubmit((values) => {
    onAuthenticated({
      mode,
      tokenPreview: 'jwt.frontend.preview',
      user: {
        email: values.email,
        name: values.name,
      },
    });
  });

  return {
    fieldRules,
    form,
    isRegister,
    mode,
    submit,
    switchMode,
  };
}
