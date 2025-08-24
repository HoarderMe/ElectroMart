// import React, { useState, useEffect } from 'react';
// import { DataGrid } from '@mui/x-data-grid';
// import { Paper, Button, TextField, Box, Typography, Checkbox, FormControlLabel } from '@mui/material';
// import axios from 'axios';

// const columns = [
//   { field: 'id', headerName: 'ID', width: 100 },
//   { field: 'name', headerName: 'Name', width: 200 },
//   {field: 'phoneNumber', headerName: 'Phone Number', width: 250},
//   { field: 'email', headerName: 'Email', width: 250 },
//   {
//     field: 'select',
//     headerName: 'Select',
//     width: 130,
//     renderCell: (params) => (
//       <Checkbox
//         color="primary"
//         checked={params.value.isSelected}
//         onChange={(event) => params.value.toggleSelection(event.target.checked, params.row)}
//       />
//     ),
//   },
// ];

// export default function Notification() {
//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomers, setSelectedCustomers] = useState([]);
//   const [emailSubject, setEmailSubject] = useState('');
//   const [emailBody, setEmailBody] = useState('');

//   const fetchCustomers = async () => {
//     const response = await axios.get('http://localhost:3000/api/users/getusers');
//     const formattedData = response.data.map((customer) => ({
//       ...customer,
//       select: {
//         isSelected: false,
//         toggleSelection: handleCustomerSelection,
//       },
//     }));
//     setCustomers(formattedData);
//   };

//   const handleCustomerSelection = (isSelected, customer) => {
//     if (isSelected) {
//       setSelectedCustomers((prev) => [...prev, customer]);
//     } else {
//       setSelectedCustomers((prev) => prev.filter((c) => c.id !== customer.id));
//     }
//   };

//   const handleSendEmail = async () => {
//     const customerEmails = selectedCustomers.map((customer) => customer.email);
//     await axios.post('http://localhost:3000/api/email/send', {
//       subject: emailSubject,
//       body: emailBody,
//       recipients: customerEmails,
//     });
//     alert('Emails sent successfully!');
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   return (
//     <Paper sx={{ padding: '16px', width: '95%', margin: 'auto' }}>
//       <Typography variant="h5" gutterBottom>
//         Email Marketing Dashboard
//       </Typography>

//       <Box sx={{ marginBottom: '16px' }}>
//         <TextField
//           label="Email Subject"
//           variant="outlined"
//           fullWidth
//           value={emailSubject}
//           onChange={(e) => setEmailSubject(e.target.value)}
//           sx={{ marginBottom: '16px' }}
//         />
//         <TextField
//           label="Email Body"
//           variant="outlined"
//           fullWidth
//           multiline
//           rows={4}
//           value={emailBody}
//           onChange={(e) => setEmailBody(e.target.value)}
//           sx={{ marginBottom: '16px' }}
//         />
//       </Box>

//       <DataGrid
//         rows={customers}
//         columns={columns}
//         checkboxSelection={false}
//         disableSelectionOnClick
//         autoHeight
//         pageSizeOptions={[5, 10]}
//         sx={{ marginBottom: '16px' }}
//       />

//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleSendEmail}
//         disabled={selectedCustomers.length === 0 || !emailSubject || !emailBody}
//       >
//         Send Email
//       </Button>
//     </Paper>
//   );
// }


import React from 'react';
    import { Box, Typography } from '@mui/material';

const Notification = () => {
  return (
    

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="50vh"
                // bgcolor="#f5f5f5"
            >
                <Typography variant="h4" color="primary">
                    Coming Soon!
                </Typography>
            </Box>

  )
}

export default Notification
