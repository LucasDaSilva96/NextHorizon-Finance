import React from 'react';
import { FormControl, FormField, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Control, FieldPath } from 'react-hook-form';
import { z } from 'zod';
import { formSchema } from '@/lib/utils';

const FORM_SCHEMA = formSchema('sign-up');

interface CustomInputProps {
  control: Control<z.infer<typeof FORM_SCHEMA>>;
  name: FieldPath<z.infer<typeof FORM_SCHEMA>>;
  placeholder: string;
  label: string;
}

export default function CustomInput({
  control,
  name,
  placeholder,
  label,
}: CustomInputProps) {
  const autoComplete =
    name === 'password'
      ? 'password'
      : name === 'email'
      ? 'email'
      : name === 'address1'
      ? 'address-level1'
      : name === 'firstName'
      ? 'given-name'
      : name === 'lastName'
      ? 'family-name'
      : name === 'city'
      ? 'address-level2'
      : name === 'state'
      ? 'address-level1'
      : name === 'postalCode'
      ? 'address-level2'
      : name === 'dateOfBirth'
      ? 'bday'
      : name === 'ssn'
      ? 'text'
      : 'text';

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className='form-item'>
          <FormLabel htmlFor={name} className='form-label'>
            {label}
          </FormLabel>
          <div className='flex w-full flex-col'>
            <FormControl id={name}>
              <Input
                type={name === 'password' ? 'password' : 'text'}
                placeholder={placeholder}
                className='input-class'
                autoComplete='a'
                {...field}
              />
            </FormControl>
            <FormMessage className='form-message mt-2'></FormMessage>
          </div>
        </div>
      )}
    />
  );
}
