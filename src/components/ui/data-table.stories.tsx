import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DataTable, type Column } from './data-table';
import { Badge } from './badge';

const meta: Meta<typeof DataTable<User>> = {
  title: 'Components/DataTable',
  component: DataTable as any,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data types
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastLogin: string;
}

// Sample data
const sampleUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'active',
    joinDate: '2023-01-15',
    lastLogin: '2024-01-15 10:30:00',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'User',
    status: 'active',
    joinDate: '2023-03-22',
    lastLogin: '2024-01-14 15:45:00',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'Manager',
    status: 'inactive',
    joinDate: '2023-02-10',
    lastLogin: '2024-01-10 09:15:00',
  },
  {
    id: 4,
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    role: 'User',
    status: 'pending',
    joinDate: '2024-01-01',
    lastLogin: '2024-01-13 14:20:00',
  },
  {
    id: 5,
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    role: 'User',
    status: 'active',
    joinDate: '2023-12-05',
    lastLogin: '2024-01-15 11:00:00',
  },
];

// Column definitions
const basicColumns: Column<User>[] = [
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
    sortable: true,
  },
  {
    key: 'email',
    title: 'Email',
    dataIndex: 'email',
    sortable: true,
  },
  {
    key: 'role',
    title: 'Role',
    dataIndex: 'role',
    sortable: true,
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    sortable: true,
    render: (status: string) => {
      const variant = status === 'active' ? 'default' : 
                    status === 'inactive' ? 'destructive' : 'secondary';
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
];

const extendedColumns: Column<User>[] = [
  ...basicColumns,
  {
    key: 'joinDate',
    title: 'Join Date',
    dataIndex: 'joinDate',
    sortable: true,
    render: (date: string) => new Date(date).toLocaleDateString(),
  },
  {
    key: 'lastLogin',
    title: 'Last Login',
    dataIndex: 'lastLogin',
    sortable: true,
    render: (datetime: string) => new Date(datetime).toLocaleString(),
  },
];

// Story with selection handler
const SelectableTable = (args: any) => {
  const [selectedRows, setSelectedRows] = useState<User[]>([]);
  
  return (
    <div className="space-y-4">
      {selectedRows.length > 0 && (
        <div className="p-4 bg-primary-light rounded-md">
          <p className="text-sm font-medium">
            Selected {selectedRows.length} user(s): {selectedRows.map(u => u.name).join(', ')}
          </p>
        </div>
      )}
      <DataTable
        {...args}
        onRowSelect={setSelectedRows}
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    data: sampleUsers,
    columns: basicColumns,
  },
};

export const WithSelection: Story = {
  render: SelectableTable,
  args: {
    data: sampleUsers,
    columns: basicColumns,
    selectable: true,
  },
};

export const ExtendedColumns: Story = {
  args: {
    data: sampleUsers,
    columns: extendedColumns,
  },
};

export const Loading: Story = {
  args: {
    data: [],
    columns: basicColumns,
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    data: [],
    columns: basicColumns,
    emptyMessage: 'No users found. Try adjusting your search criteria.',
  },
};

export const CustomStyling: Story = {
  args: {
    data: sampleUsers.slice(0, 3),
    columns: [
      {
        key: 'name',
        title: 'Full Name',
        dataIndex: 'name',
        sortable: true,
        render: (name: string, record: User) => (
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-muted-foreground">{record.email}</div>
          </div>
        ),
      },
      {
        key: 'role',
        title: 'Role',
        dataIndex: 'role',
        align: 'center',
        render: (role: string) => (
          <Badge variant="outline">{role}</Badge>
        ),
      },
      {
        key: 'status',
        title: 'Status',
        dataIndex: 'status',
        align: 'center',
        render: (status: string) => {
          const colors = {
            active: 'bg-success text-success-foreground',
            inactive: 'bg-destructive text-destructive-foreground',
            pending: 'bg-warning text-warning-foreground'
          };
          return (
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors]}`}>
              {status}
            </span>
          );
        },
      },
      {
        key: 'actions',
        title: 'Actions',
        dataIndex: 'id',
        align: 'right',
        render: () => (
          <div className="space-x-2">
            <button className="text-primary hover:text-primary-hover text-sm">Edit</button>
            <button className="text-destructive hover:text-destructive/80 text-sm">Delete</button>
          </div>
        ),
      },
    ],
    className: 'shadow-lg',
  },
};