import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle
} from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    controlPanel: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '16px',
        padding: '16px',
    },
});

const Transaction = () => {
    const classes = useStyles();
    const [customers, setCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        email: '',
        phoneNumber: '',
    });

    const fetchCustomers = async () => {
        // Fetch customers from the server
        const response = await axios.get('http://localhost:3000/api/users/getusers');
        setCustomers(response.data);
    };

    const handleSearch = () => {
        const filteredCustomers = customers.filter((customer) =>
            customer.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setCustomers(filteredCustomers);
    };

    const handleAddCustomer = async () => {
        // Add new customer to the database
        await axios.post('http://localhost:3000/api/users/adduser', newCustomer);
        fetchCustomers(); // Refresh customer list
        setOpen(false); // Close the dialog
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <div className='h-screen'>
            {/* Control Panel */}
            <div className={classes.controlPanel}>
                <div>
                    <TextField
                        label="Search"
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={handleSearch} style={{ marginLeft: '8px' }}>
                        Search
                    </Button>
                </div>
                <Button variant="contained" color="secondary" onClick={() => setOpen(true)}>
                    Add Customer
                </Button>
            </div>

            {/* Customer Table */}
            <TableContainer component={Paper} className='max-w-[95%] mx-auto'>
                <Table className={classes.table} aria-label="Customer Table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.map((customer) => (
                            <TableRow key={customer.id}>
                                <TableCell>#{customer.id.slice(0, 6).toUpperCase()}</TableCell>
                                <TableCell>{customer.name}</TableCell>
                                <TableCell>{customer.email}</TableCell>
                                <TableCell>{customer.phoneNumber}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Customer Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Phone Number"
                        type="text"
                        fullWidth
                        value={newCustomer.phoneNumber}
                        onChange={(e) => setNewCustomer({ ...newCustomer, phoneNumber: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddCustomer} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Transaction;
