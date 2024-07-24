import React from 'react';
import { FormControl, FormField, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Control, FieldPath } from 'react-hook-form';
import { z } from 'zod';
import { formSchema } from '@/lib/utils';

interface CustomInputProps {
  control: Control<z.infer<typeof formSchema>>;
  name: FieldPath<z.infer<typeof formSchema>>;
  placeholder: string;
  label: string;
  type: string;
  autocomplete: 'true' | 'false';
}

export default function CustomInput({
  control,
  name,
  placeholder,
  label,
  type,
  autocomplete,
}: CustomInputProps) {
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
                type={type}
                placeholder={placeholder}
                className='input-class'
                autoComplete={autocomplete}
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
