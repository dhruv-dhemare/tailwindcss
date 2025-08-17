import React, { useState } from "react";
import { InputField } from "@/components/ui/input-field";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";

// Sample data for DataTable demo
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
}

const sampleUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', status: 'inactive' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'User', status: 'pending' },
];

const columns: Column<User>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email', sortable: true },
  { key: 'role', title: 'Role', dataIndex: 'role', sortable: true },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    sortable: true,
    render: (status: string) => {
      const variant = status === 'active' ? 'default' : status === 'inactive' ? 'destructive' : 'secondary';
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
];

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">React Components</h1>
          <p className="text-muted-foreground">InputField and DataTable components</p>
        </div>

        {/* InputField Demo */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">InputField Component</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <InputField
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helperText="We'll never share your email."
              showClear
              onClear={() => setEmail("")}
            />
            
            <InputField
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showClear
              onClear={() => setPassword("")}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <InputField variant="filled" placeholder="Filled variant" />
            <InputField variant="outlined" placeholder="Outlined variant" />
            <InputField variant="ghost" placeholder="Ghost variant" />
          </div>
        </div>

        {/* DataTable Demo */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">DataTable Component</h2>
          
          <DataTable
            data={sampleUsers}
            columns={columns}
            selectable
            onRowSelect={setSelectedUsers}
          />
          
          {selectedUsers.length > 0 && (
            <div className="p-4 bg-primary-light rounded-md">
              <p className="text-sm font-medium">
                Selected: {selectedUsers.map(u => u.name).join(', ')}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Index;