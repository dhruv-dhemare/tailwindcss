import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { InputField } from './input-field';

const meta: Meta<typeof InputField> = {
  title: 'Components/InputField',
  component: InputField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['filled', 'outlined', 'ghost'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    loading: {
      control: { type: 'boolean' },
    },
    invalid: {
      control: { type: 'boolean' },
    },
    showClear: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Controlled component wrapper for stories
const ControlledInput = (args: any) => {
  const [value, setValue] = useState(args.value || '');
  
  return (
    <div className="w-80">
      <InputField
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue('')}
      />
    </div>
  );
};

export const Default: Story = {
  render: ControlledInput,
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    helperText: 'We\'ll never share your email with anyone else.',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <ControlledInput 
        variant="filled" 
        label="Filled Input" 
        placeholder="Type something..." 
      />
      <ControlledInput 
        variant="outlined" 
        label="Outlined Input" 
        placeholder="Type something..." 
      />
      <ControlledInput 
        variant="ghost" 
        label="Ghost Input" 
        placeholder="Type something..." 
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <ControlledInput 
        size="sm" 
        label="Small Input" 
        placeholder="Small size" 
      />
      <ControlledInput 
        size="md" 
        label="Medium Input" 
        placeholder="Medium size" 
      />
      <ControlledInput 
        size="lg" 
        label="Large Input" 
        placeholder="Large size" 
      />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <ControlledInput 
        label="Normal State" 
        placeholder="Type something..." 
        value="Sample text"
      />
      <ControlledInput 
        label="Disabled State" 
        placeholder="Disabled input" 
        disabled 
        value="Cannot edit this"
      />
      <ControlledInput 
        label="Loading State" 
        placeholder="Loading..." 
        loading 
      />
      <ControlledInput 
        label="Error State" 
        placeholder="Type something..." 
        invalid 
        errorMessage="This field is required"
      />
    </div>
  ),
};

export const Password: Story = {
  render: ControlledInput,
  args: {
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    helperText: 'Must be at least 8 characters long',
  },
};

export const WithClearButton: Story = {
  render: ControlledInput,
  args: {
    label: 'Search',
    placeholder: 'Search for anything...',
    showClear: true,
    value: 'Clear me!',
  },
};

export const PasswordWithClear: Story = {
  render: ControlledInput,
  args: {
    type: 'password',
    label: 'Password',
    placeholder: 'Enter password',
    showClear: true,
    value: 'secretpassword',
  },
};