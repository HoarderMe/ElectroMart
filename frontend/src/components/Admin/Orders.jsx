import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, TextField, MenuItem, Tabs, Tab, Divider, Select, FormControl, InputLabel, Box, Button } from '@material-ui/core';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import axios from 'axios';
import { Badge, CheckCheckIcon, EllipsisVertical, Search } from 'lucide-react';
import { AccountCircle, BorderAll, BorderAllOutlined, Height } from '@material-ui/icons';



const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(2),
    },
    ordersContainer: {
        height: '100%',
        overflow: 'auto',
    },
    receiptContainer: {
        height: '100%',
        padding: theme.spacing(2),
        backgroundColor: '#f5f5f5',
    },
    controlPanel: {
        marginBottom: theme.spacing(2),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filters: {
        display: 'flex',
        gap: theme.spacing(2),
    },
}));

const Orders = () => {
    const classes = useStyles();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
        };

    const fetchOrders = async () => {
        const response = await axios.get('http://localhost:5000/api/orders/001');
        setOrders(response.data.data);
        console.log(response.data)
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        setSelectedOrder(orders.length > 0 ? orders[0] : null);
    }, [orders]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    async function changeStatus(orderNumber, status) {
        // const data = {
        //   'orderNumber':orderNumber,
        //   'status':status
        // }
        try {
          const productlist = await axios.post(`http://localhost:3000/api/orders/changeOrderStatus`,
            {
              orderNumber: orderNumber,
              status: status
            },
            
          )
          if(productlist.status === 200){

          console.log(productlist)
          alert(`Status Changed ${status} To Successfully!`)
            fetchOrders()
            }
        } catch (error) {
          console.log(error)
        }
    
      }
    function handleselectshange(ordernumber, value) {
        // console.log(value)
        // console.log(ordernumber)
        changeStatus(ordernumber, value);
      }

    const handleTabChange = (event, newValue) => {
        setTabValue(event.target.value);
    };

    // const filteredOrders = orders.filter(order => 
    //     order.customer.toLowerCase().includes(searchTerm.toLowerCase()) &&
    //     (statusFilter ? order.status === statusFilter : true)
    // );


    const acceptOrder = async  (orderid,status) => {
        try {
            const response =await  axios.post('http://localhost:5000/api/orders/update', { 
                orderId: orderid,
                status: status
             });
             console.log(response);
            if(response.status === 200){
                alert('Order Accepted');
                fetchOrders();
            }

        } catch (error) {
            console.log(error);
        }
    };







    return (
//         <div className={classes.root}>
//             <div className={classes.controlPanel}>
//                 <TextField
//                     label="Search Orders"
//                     variant="outlined"
//                     size="small"
//                     value={searchTerm}
//                     onChange={handleSearch}
//                 />
//                 <div className='w-[200px] '>
//                     <TextField
//                         select
//                         className='w-full'
//                         label="Filter by Status"
//                         variant="outlined"
//                         size="small"
//                         sx={{ height: 150 }}
//                         value={statusFilter}
//                         onChange={handleStatusFilterChange}
//                     >
//                         <MenuItem value="">All</MenuItem>
//                         <MenuItem value="PENDING">Pending</MenuItem>
//                         <MenuItem value="COMPLETED">Completed</MenuItem>
//                         <MenuItem value="CANCELED">Cancelled</MenuItem>
//                     </TextField>
//                 </div>
//             </div>
//             <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
//                 <Tab label="All Orders" value={"ALL ORDERS"}   />
//                 <Tab label="Pending" value={"PENDING"} />
//                 <Tab label="Completed" />
//                 <Tab label="Cancelled" />
//             </Tabs>
//             <Divider />
      
//             <Grid container spacing={2}>
//                 <Grid item xs={8} className='h-[600px] relative '>
//                     <Paper className={classes.ordersContainer}>
//                         <TableContainer  >
//                             <Table stickyHeader className='relative' aria-label="sticky table">
//                                 <TableHead  >
//                                     <TableRow>
//                                         <TableCell>ID</TableCell>
//                                         <TableCell>Customer</TableCell>
//                                         <TableCell>Status</TableCell>
//                                         <TableCell>Date</TableCell>
//                                         <TableCell>Items</TableCell>
//                                         <TableCell>Total</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {filteredOrders.map((order) => (
//                                         <TableRow key={order.id} onClick={() => setSelectedOrder(order)} className='hover:bg-gray-100'>
//                                             <TableCell>#{order.id.slice(0, 6).toUpperCase()}</TableCell>
//                                             <TableCell>{order.customer}</TableCell>
//                                             <TableCell>
//                                             {/* {order.status === 'PENDING' ? (
//                                                     <span className=' font-semibold text-yellow-600 p-2 rounded-full'>Pending</span>
//                                                 ) : order.status === 'COMPLETED' ? (
//                                                     <span className=' text-green-700 font-semibold p-2 rounded-full'>Completed</span>
//                                                 ) : order.status === 'CANCELED' ? (
//                                                     <span className='font-semibold text-red-500 p-2 rounded-full'>Cancelled</span>
//                                                 ) :order.status === 'REFUNDED' ? (
//                                                     <span className='font-semibold text-purple-500 p-2 rounded-full'>Cancelled</span>
//                                                 ) :null
                                                    
//                                                  } */}

// <FormControl fullWidth>
//   {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
//   <Select
//     labelId="demo-simple-select-label"
//     id="demo-simple-select"
//     value={order.status}
//     onChange={(e) => handleselectshange(order.id, e.target.value)}
//   >
//     <MenuItem value={'PENDING'} > <span className=' font-semibold text-yellow-600 p-2 rounded-full'>Pending</span></MenuItem>
//     <MenuItem value={'COMPLETED'}>  <span className=' text-green-700 font-semibold p-2 rounded-full'>Completed</span></MenuItem>
//     <MenuItem value={'REFUNDED'}><span className='font-semibold text-purple-500 p-2 rounded-full'>Refunded</span></MenuItem>
//     <MenuItem value={'CANCELLED'}><span className='font-semibold text-red-500 p-2 rounded-full'>Cancelled</span></MenuItem>
//   </Select>
// </FormControl>
// {/* <Select className='mx-auto flex font-medium h-[40px] flex-col w-[140px] items-center justify-center p-2 ' variant='filled' value={order.status}
//                               onChange={(e) => handleselectshange(order.id, e.target.value)} >

//                               <option value='PENDING' className='font-medium' >PENDING
//                               </option>
//                               <option value='COMPLETED' className='font-medium' >COMPLETED
//                               </option>
//                               <option value='REFUNDED' className='font-medium '>REFUNDED</option>
//                               <option value='CANCELLED' className='font-medium '>CANCELLED</option>
//                             </Select> */}
//                                             </TableCell>
//                                             <TableCell>{new Date(order.CreatedAt).toLocaleString()}</TableCell>
//                                             <TableCell>{order.items.length}</TableCell>
//                                             <TableCell>{order.total}</TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </Paper>
//                 </Grid>
//                 <Grid item xs={4}>
//                     <Paper className={classes.receiptContainer}>
//                         {selectedOrder && (
//                             <>
//                                 <div className='flex flex-row justify-between'>
//                                     <div>
//                                         <h2 className='text-lg font-semibold'>Order #{selectedOrder?.id.slice(0,6).toUpperCase()}</h2>
//                                         <p>{new Date(selectedOrder?.CreatedAt).toLocaleString()}</p>
//                                     </div>
//                                     <div className='flex flex-row gap-2'>
//                                         <button className='bg-white text-black px-2 rounded-md border-2 border-silver'>Print Order</button>
//                                         <button><EllipsisVertical /></button>
//                                     </div>
//                                 </div>
//                                 <Divider />
//                                 <div className='mt-4'>
//                                     <h3 className='font-semibold'>Order Details</h3>
//                                     {selectedOrder.items.map((item) => (
//                                         <div key={item.id} className='flex flex-row justify-between'>
//                                             <div>
//                                                 <p>{item.productVariant.product.name} x {item.quantity}</p>
//                                                 <p className='flex items-center gap-2'>
//                                                     <span className='text-sm font-semibold'>{item.productVariant.size.toUpperCase()}</span>
//                                                     <Badge size={17} fill={item.productVariant.color} color={item.productVariant.color} />
//                                                 </p>
//                                             </div>
//                                             <p>Rs{item.price}</p>
//                                         </div>
//                                     ))}
//                                 </div>
//                                 <Divider />
//                                 <div className='mt-4'>
//                                     <h3 className='font-semibold'>Customer Information</h3>
//                                     <p>Name: {selectedOrder.customer}</p>
//                                     <p>Email: {selectedOrder.email}</p>
//                                     <p>Phone: {selectedOrder.phoneNumber}</p>
//                                 </div>
//                                 <Divider />
//                                 <div className='mt-4'>
//                                     <h3 className='font-semibold'>Payment Method</h3>
//                                     <p>Cash on Delivery</p>
//                                 </div>
//                             </>
//                         )}
//                     </Paper>
//                 </Grid>
//             </Grid>
           
//         </div>
    <>
        <div className=' h-[calc(100vh_-_7vh)] p-5 flex flex-col -mt-5 '>
                <div className='flex flex-row justify-between align-top mb-3'>
                        <h1 className='text-2xl font-semibold'>
                            Orders
                        </h1>

                        
                </div>
    <div className='flex flex-row justify-between'>
                  <div className='flex flex-row justify-start gap-4 align-top '>
         
                            <div className='px-5 text-white font-semibold bg-green-700 py-1 rounded-lg border-2 broder-gray-400'>
                                    Pending
                            </div>
                            <div className='px-5 text-black font-semibold bg-white py-1 rounded-lg border-2 broder-gray-400'>
                                    Completed
                            </div>
                            <div className='px-5 text-black font-semibold bg-white py-1 rounded-lg border-2 broder-gray-400'>
                                    Cancelled
                            </div>
   </div>         
   <div className='flex flex-row rounded-lg items-center gap-2 bg-white h-10'>
                        
                            <Search className='h-7 w-7'/>
                           <TextField id="input-with-sx" label="With sx" variant="outlined"
                           size='small'
                            sx={{ width: '300px' ,
                          
                            }}
                        
                           />
                           
                      
                        </div>
                        </div>     

              <div className='w-full mt-2 h-full flex gap-4  flex-row overflow-y-auto overflow-x-hidden'>
                            <div className='w-[70%]  grid grid-cols-2 gap-7 pb-10'>

                                   
                                { orders.length > 0 ?
                                    orders.map((order) => (
                                      <div key={order.id} className={`w-[390px] flex flex-col p-3 rounded-md h-[400px] ${
                                        selectedOrder?.order.id === order.order.id ? 'bg-[#cde8f5]' : 'bg-white'
                                      } shadow-xl`}>
                                            <div className='flex flex-row justify-between'>
                                                    <div className='flex flex-row gap-2 items-start'>
                                                            <div className='w-12 flex items-center justify-center text-white font-semibold h-12 bg-green-700 rounded-lg'>
                                                                    <div>
                                                                        AG
                                                                    </div>
                                                            </div>
                                                            <div className='flex flex-col gap-5'>
                                                            <div className='flex flex-col items-start justify-center text-black font-semibold rounded-lg'>
                                                                    <div>
                                                                        #{order?.order.id.toUpperCase().slice(0, 6)}
                                                                    </div>

                                                                    <div className='text-gray-600 text-sm'>
                                                                       {order?.profile.first_name} {order?.profile.last_name}
                                                                    </div>
                                                            </div>
                                                             </div>

                                                           
                                                    </div>
                                                    <div className='flex flex-col '>
                                                            <div className='px-2 py-1 bg-[#c9fee5] rounded-lg flex justify-around gap-2 items-center'>
                                                                    <CheckCheckIcon className='h-5 w-5 text-green-900'/>
                                                                    <div className=' font-semibold text-green-900'>
                                                                    {order?.order.orderStatus}
                                                                    </div>
                                                            </div>
                                                    </div>
                                                 
                                            </div>
                                            <div className=' text-gray-600  font-semibold flex flex-row mt-3 justify-between mb-3'>
                                                <div>
                                                    {
                                                        new Date(order?.order.createdAt).toLocaleDateString()
                                                    }
</div>
                                                    <div>
                                                        {
                                                        new Date(order?.order.createdAt).toLocaleTimeString()
                                                    }
                                                    </div>
                                            </div>
                                            <Divider />

                                            <div className='flex flex-col mt-2 h-[200px] '>
                                                    <div className='flex flex-row justify-between'>
                                                        <div className='text-gray-600 font-semibold'>
                                                            Items
                                                        </div>

                                                        <div className='text-gray-600 font-semibold'>
                                                            Qty
                                                            </div>

                                                            <div className='text-gray-600 font-semibold'>
                                                            Price
                                                            </div>
                                                    </div>

                                                    {
                                                        order?.items.map((item) => (
                                                            <div key={item.id} className='flex flex-row justify-between mt-2 font-semibold'>
                                                                <div className='w-[180px] '>
                                                                    {item.name}
                                                                </div>
                                                                <div className=' w-[150px]'>
                                                                    {item.quantity}
                                                                </div>
                                                                <div className=' w-[50px] text-right'>
                                                                    {parseInt(item.price)}
                                                                </div>
                                                            </div>
                                                        ))
                                                    }

                                                   
                                            </div>
                                            <Divider className='mt-2'/>
                                            <div className='flex flex-row justify-between my-2'>
                                                <div className='text-gray-600 font-semibold mt-2'>
                                                    Total
                                                        </div>

                                                        <div className='text-black font-semibold mt-2'>
                                                            {parseInt(order?.order.totalAmount)}
                                                            </div>
                                            </div>
                                                    <div className='flex flex-row gap-3 justify-between'>
                                                            <button onClick={
                                                                () => setSelectedOrder(order)
                                                            } className='bg-[#f5f7f7] text-[#036766] font-semibold rounded-lg p-2 w-1/2 hover:bg-[#3f7676] hover:text-[white]'>
                                                                See Details
                                                            </button>

                                                            <button className='bg-yellow-500 text-black font-semibold rounded-lg p-2 w-1/2 hover:bg-yellow-500'>
                                                                View Bill
                                                            </button>
                                                    </div>
                                      </div>
                                    )) : <>
                                    <div className='w-full h-full flex flex-col items-center justify-center'>
                                        <div className='text-gray-600 font-semibold'>
                                          Fetching Orders...
                                        </div>
                                    </div>
                                    </>

                                }
                            </div>  
                            <div className='w-[35%]  sticky top-0 h-full shadow-xl'>
                            <div className='w-auto flex flex-col justify-between p-3  h-full bg-[#cde8f5] '>
                                            <div className='flex flex-row justify-between'>
                                                    <div className='flex flex-row gap-2 items-start'>
                                                            <div className='w-12 flex items-center justify-center text-white font-semibold h-12 bg-green-700 rounded-lg'>
                                                                    <div>
                                                                        AG
                                                                    </div>
                                                            </div>
                                                            <div className='flex flex-col gap-5'>
                                                            <div className='flex flex-col items-start justify-center text-black font-semibold rounded-lg'>
                                                                    <div>
                                                                        #{selectedOrder?.order.id.toUpperCase().slice(0, 6)}
                                                                    </div>

                                                                    <div className='text-gray-600 text-sm'>
                                                                        Devansh Bhagania
                                                                    </div>
                                                            </div>
                                                             </div>

                                                           
                                                    </div>
                                                    <div className='flex flex-col '>
                                                            <div className='px-2 py-1 bg-[#c9fee5] rounded-lg flex justify-around gap-2 items-center'>
                                                                    <CheckCheckIcon className='h-5 w-5 text-green-900'/>
                                                                    <div className=' font-semibold text-green-900'>
                                                                    {selectedOrder?.order.orderStatus}
                                                                    </div>
                                                            </div>
                                                    </div>
                                            </div>
                                            <div className=' text-gray-600  font-semibold flex flex-row mt-3 justify-between mb-3'>
                                                <div>
                                                    {
                                                        new Date(selectedOrder?.order.createdAt).toLocaleDateString()
                                                    }
</div>
                                                    <div>
                                                        {
                                                        new Date(selectedOrder?.order.createdAt).toLocaleTimeString()
                                                    }
                                                    </div>
                                            </div>
                                            <Divider />
                                                    
                                                    {/* order tracking  */}
                                            <div className='flex flex-col mb-3 mt-2'>
                                                    <div className='font-semibold'>
                                                        Order Tracking
                                                    </div>

                                                    <div className='flex mt-5 flex-row h-auto relative justify-around gap-5 w-full my-3'>

                                                        <div className='w-full h-[1px] bg-gray-200 absolute top-2 -z-1'>
                                                            
                                                        </div>

                                                        {
                                                            selectedOrder?.tracking.map((track,index) => (
                                                                <div key={track.id} className='z-[100]'>
                                                                    <div className='flex  flex-col items-start'>
                                                                        <div className='w-6 h-6 bg-green-700 rounded-full flex items-center justify-center text-white'>
                                                                            <div>
                                                                                {index + 1}
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            {track.status === 'order_placed' ?  'Pending' :track.status }
                                                                        </div>
                                                                        
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }



                                                  



                                                   </div>

                                            </div>

                                                 <Divider />

                                                 {/* order items  */}
                                            <div className='flex flex-col mt-2 h-[200px] '>
                                                    <div className='flex flex-row justify-between'>
                                                        <div className='text-gray-600 font-semibold'>
                                                            Items
                                                        </div>

                                                        <div className='text-gray-600 font-semibold'>
                                                            Qty
                                                            </div>

                                                            <div className='text-gray-600 font-semibold'>
                                                            Price
                                                            </div>
                                                    </div>

                                                    {
                                                        selectedOrder?.items.map((item) => (
                                                            <div key={item.id} className='flex flex-row justify-between mt-2 font-semibold'>
                                                                <div className='w-[180px] '>
                                                                    {item.name}
                                                                </div>
                                                                <div className=' w-[150px]'>
                                                                    {item.quantity}
                                                                </div>
                                                                <div className=' w-[50px] text-right'>
                                                                    {parseInt(item.price)}
                                                                </div>
                                                            </div>
                                                        ))
                                                    }

                                                   
                                            </div>
                                            <Divider className='mt-2'/>

                                            {/* info  */}
                                            <div className='flex flex-row justify-between my-2'>
                                                <div className='text-gray-600 font-semibold mt-2'>
                                                    Total
                                                        </div>

                                                        <div className='text-black font-semibold mt-2'>
                                                            {parseInt(selectedOrder?.order.totalAmount)}
                                                            </div>
                                            </div>
                                                        <div className='flex flex-col h-auto '>
                                                          
                                                            <div className='flex flex-row justify-between'>
                                                                <div className='text-gray-600 font-semibold'>
                                                                    Phone Number
                                                                        </div>

                                                                        <div className='text-black font-semibold'>
                                                                            {selectedOrder?.profile.phone_number}
                                                                            </div>
                                                            </div>
                                                            <div className='flex flex-row justify-between'>
                                                                <div className='text-gray-600 font-semibold'>
                                                                    Payment Status
                                                                        </div>

                                                                        <div className='text-green-800 font-semibold'>
                                                                            Paid
                                                                            </div>
                                                            </div>
                                                            <div className='flex flex-row justify-between'>
                                                                <div className='text-gray-600 font-semibold'>
                                                                    Payment Id
                                                                        </div>

                                                                        <div className='text-black font-semibold'>
                                                                            {selectedOrder?.order.phone_number}
                                                                            </div>
                                                            </div>
                                                        </div>


                                                    {/* button  */}
                                                    <div className='flex flex-row gap-3 mt-4 justify-between'>
                                                            <button onClick={
                                                                () =>{
                                                                    selectedOrder?.order.orderStatus === 'pending' ?            
                                                                    acceptOrder(selectedOrder.order.id, 'Accepted') : selectedOrder.order.orderStatus === 'Accepted' ?
                                                                    acceptOrder(selectedOrder.order.id, 'Preparing') : selectedOrder.order.orderStatus === 'Preparing' ? 
                                                                    acceptOrder(selectedOrder.order.id, 'Completed') :
                                                                    alert('Order Already Completed')
                                                                }
                                                            } className='bg-green-700 text-white font-semibold rounded-lg p-2 w-1/2 hover:bg-[#3f7676] hover:text-[white]'
                                                          >
                                                               {
                                                                     selectedOrder?.order.orderStatus === 'pending' ? 'Accept Order' : selectedOrder?.order.orderStatus === 'Accepted' ? 'Start Preparing' : 'Order Completed'
                                                               }
                                                            </button>

                                                            <button className='bg-yellow-500 text-black font-semibold rounded-lg p-2 w-1/2 hover:bg-yellow-500'>
                                                                Print Bill
                                                            </button>
                                                    </div>
                                      </div>
                                </div>
                </div>              
                 


        </div>

    </>
    );
};

export default Orders;



