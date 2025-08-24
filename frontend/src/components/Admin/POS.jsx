import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Breadcrumbs, Card, Grid, Input, Paper, Typography } from '@material-ui/core';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import axios from 'axios';
import { Badge, EllipsisVertical, Menu } from 'lucide-react';
import { Button, CardContent, Divider } from '@mui/material';
import { Image } from '@material-ui/icons';
import Search from './Search';
import { Link } from 'react-router-dom';

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
}));

const POS = () => {
    const classes = useStyles();
    // const orders = [
    //     { id: 1, customer: 'John Doe', total: 100 },
    //     { id: 2, customer: 'Jane Smith', total: 200 },
    //     { id: 3, customer: 'Bob Johnson', total: 150 },
    // ];
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [name, setName] = useState(`CM${Math.random().toString(36).substring(7)}`);
    const [email, setEmail] = useState(`${name}${'@gmail.com'}`);
    const [phone, setPhone] = useState('');
    const [customers, setCustomers] = useState([]);
    const [selectedOrderItems, setSelectedOrderItems] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(
        orders && orders.length > 0 ? orders[0] : null
    );

    // const fetchOrders = async () => {
    //     // Fetch orders from the server
    //     const response = await axios.get('http://localhost:3000/api/orders/getorders');
    //     console.log(response.data);

    //     setOrders(response.data.map((order) => ({
    //         id: `#${order.id.slice(0,6).toUpperCase()}`,
    //         customer: order.user.name,
    //         status: order.status,
    //         items: order.items,
    //         total: `Rs${order.totalAmount.toFixed(2)}`,
    //         CreatedAt: order.createdAt,
    //         user: order.user,
    //     })));
    // }

    const fetchCustomers = async () => {
        // Fetch customers from the server
        const response = await axios.get('http://localhost:3000/api/users/getusers');
        console.log(response.data);
        setCustomers(response.data);
    }

    const fetchProducts = async () => {
        // Fetch products from the server
        const response = await axios.get('http://localhost:5000/api/menu-items/001');
        console.log(response.data);
        setProducts(response.data);
    }


    useEffect(() => {
        // fetchOrders();
        // fetchCustomers();
        fetchProducts();
    }
    , [])

   

    const addToCart = (product) => {
        // const existingItem = selectedOrderItems.find(
        //     (item) => item.product.id === product.id && item.variant.id === variant.id
        // );

        // if (existingItem) {
        //     const updatedItems = selectedOrderItems.map((item) => {
        //         if (item.product.id === product.id && item.variant.id === variant.id) {
        //             return {
        //                 ...item,
        //                 quantity: item.quantity + 1,
        //             };
        //         }
        //         return item;
        //     });

        //     setSelectedOrderItems(updatedItems);
        // } else {
        //     const newItem = {
        //         product,
        //         variant,
        //         quantity: 1,
        //     };

        //     setSelectedOrderItems([...selectedOrderItems, newItem]);
        // }

        const existingItem = selectedOrderItems.find(
            (item) => item.product.id === product.id
        );

        if (existingItem) {
            const updatedItems = selectedOrderItems.map((item) => {
                if (item.product.id === product.id) {
                    return {
                        ...item,
                        quantity: item.quantity + 1,
                    };
                }
                return item;
            });

            setSelectedOrderItems(updatedItems);
        } else {
            const newItem = {
                product,
                quantity: 1,
            };


            setSelectedOrderItems([...selectedOrderItems, newItem]);
        }


        console.log(selectedOrderItems);
    };


    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentDateTime(new Date());
      }, 1000);
  
      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);


    const createOrder = async () => {   
        const order = {
                 userId:"c03ffb05-697b-4b59-913e-f6e24819c156", 
                 outletId: "001",
                totalAmount: selectedOrderItems.reduce(
                    (acc, item) => acc + item.quantity * item.product.price,
                    0
                ),
                paymentMethod:"UPI",
                items: selectedOrderItems.map((item) => ({
                menuItemId: item.product.id,
                price: item.product.price,
                quantity: item.quantity,
            })),
        };

        console.log(order);
       try {
        const response = await axios.post('http://localhost:5000/api/orders', order);
        console.log(response.data);
            if(response.data){
                alert('Order created successfully');
                setSelectedOrderItems([]);
                setName(`CM${Math.random().toString(36).substring(7)}`);
                setEmail(`${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`);
                setPhone('');
            }

       } catch (error) {
           console.log(error);
        
       }
    }

    const breadcrumbs = [
        <Link key="1" color="inherit" to="/">
          Home
        </Link>,
        <Link key="2" color="inherit" to="/material-ui/getting-started/installation/">
          Admin
        </Link>,
        <Typography key="3" color="textPrimary">
          POS
        </Typography>,
      ];
    
    

    return (
        <div className='h-[calc(100vh_-_11vh)]  p-4 '>
             <div className='flex flex-col justify-between gap-3 '>
        <div className='flex justify-between'>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
          <div className='flex gap-3 items-center'>
            <Search />
            {/* <div className='rounded-lg border-2 p-1 border-gray-200 bg-gray-300'>
              <NotificationsRou />
            </div> */}
          </div>
        </div>
        <h1 className='text-xl font-semibold'>Dashboard</h1>
      </div>
            <Grid container spacing={2}>
            <Grid item xs={4}>
                    <Paper className='flex flex-col gap-7 p-3 w-full' >
                            <div className='flex flex-row  justify-between w-[100%]'>
                                <div>
                                <h2 className='text-lg font-semibold'>Order {selectedOrder?.id}</h2>
                                <p>{currentDateTime.toLocaleString()}</p>
                             
                                </div>
                               
                                <div className='flex flex-row gap-2'>
                                <button onClick={()=>{
                                    setSelectedOrderItems([]);
                                    console.log(selectedOrderItems);
                                }} className='bg-white text-black px-2  rounded-md border-2 border-silver'>Print Order</button>
                                <button><EllipsisVertical/></button>
                                </div>
                               
                            </div>       
                            <div>
                                <h1 className='font-semibold'>
                                    Order Details
                                </h1>
                                <div className='custom-scrollbar flex flex-col max-h-[150px] overflow-auto gap-2 pr-3'>
                                    {
                                        selectedOrderItems.map((item) => (
                                            <div key={item.id} className='flex flex-row justify-between'>
                                                <p>{item.product.name} x {item.quantity}</p>
                                                <p className='font-semibold text-lg'>₹ {parseInt(item.product.price) * item.quantity}</p>
                                            </div>
                                        ))
                                    }
                                    <Divider    />
                                </div>
                                <div className='flex flex-col gap-2 mt-6 w-[97%]'>
                                    <div className='flex flex-row justify-between '>
                                        <p>Subtotal</p>
                                        <p className='text-lg font-semibold'>₹ {
                                            selectedOrderItems.reduce(
                                                (acc, item) => acc + item.quantity * item.product.price,
                                                0
                                            )
                                            }</p>
                                    </div>
                                    <div className='flex flex-row justify-between'>
                                        <p>Shipping</p>
                                        <p className='text-lg font-semibold'>₹ 0</p>
                                    </div>
                                    <div className='flex flex-row justify-between'>
                                        <p>Total</p>
                                        <p className='text-lg font-semibold'>₹ {
                                            selectedOrderItems.reduce(
                                                (acc, item) => acc + item.quantity * item.product.price,
                                                0
                                            )
                                            }</p>
                                    </div>
                                </div>
                                <Divider    />
                                <div className='flex flex-col gap-2 mb-3 mt-6'>
                                    <h1 className='font-semibold'>
                                        Customer information
                                    </h1>
                                    <div className='flex flex-col gap-2'>
                                        <div className='flex flex-row justify-between'>
                                            <p className='text-gray-500 font-medium'>Name</p>
                                            <Input value={name} onChange={
        (e) => {
          const newName = e.target.value;
          setName(newName);
          setEmail(`${newName.toLowerCase().replace(/\s+/g, '')}@gmail.com`);
        }
      } />
                                        </div>
                                        <div className='flex flex-row justify-between'>
                                            <p className='text-gray-500 font-medium'>Email</p>
                                            <Input value={email} onChange={
                                                (e) => setEmail(e.target.value)
                                            } />
                                        </div>
                                        <div className='flex flex-row justify-between'>
                                            <p className='text-gray-500 font-medium'>Phone</p>
                                            <Input type='number' value={phone} onChange={
                                                (e) => setPhone(e.target.value)
                                            } />
                                        </div>
                                    </div>
                                </div>
                                    <Divider    />
                                    <div className='flex flex-col gap-2 mb-3 mt-6'>
                                        <h1 className='font-semibold'>
                                            Payment Method
                                        </h1>
                                        <div className='flex flex-row justify-between'>
                                            <p className='text-gray-500 font-medium'>Method</p>
                                            <p>Cash on Delivery</p>
                                        </div>
                                    </div>

                                    <div>
                                        <Button onClick={createOrder} variant='contained' color='success' fullWidth>
                                            Checkout
                                        </Button>
                                    </div>
                                </div>                
                    </Paper>
                </Grid>
                <Grid item xs={8}>
                    <Paper className={classes.ordersContainer}>
                    <div   className='grid grid-cols-3 gap-4 p-4' >
                            {products.map((product) => (
                                <Card key={product.id} className='flex flex-col justify-between items-center gap-4 h-auto  '>
                                    <CardContent>
                                        <div className='w-[230px] h-[140px]  bg-blue-200 rounded-lg'>
                                            <img src={product.image} alt={product.name}  className='w-[230px] h-[140px]  object-cover rounded-lg' />
                                        </div>
                                        <h2 className='text-lg font-semibold'>{product.name}</h2>
                                        <p className='text-xl'>₹{parseInt(product.price)}</p>

                                            <div>
                                                <Button onClick={() => addToCart(product)} variant='contained' color='primary'>
                                                    Add
                                                </Button>
                                            </div>
                                        
                                        {/* <div className='flex flex-col gap-2 justify-between'>
                                           {
                                                  product.variants.map((variant) => (
                                                    <div key={variant.id} className='flex flex-row items-center justify-between gap-2'>
                                                        <div className='flex gap-3'>
                                                        <p className='text-gray-500'>{variant.size.toUpperCase()}</p>
                                                        <p className='text-gray-500'>{variant.color}</p>
                                                        </div>
                                                        <div className='justify-items-end'>
                                                         
                                                                <p>
                                                                 {variant.stock}
                                                                </p>
                                                          
                                                        </div>
                                                        {
                                                            variant.stock > 0 
                                                            ? (
                                                                <Button onClick={() => addToCart(product, variant)} variant='contained' color='primary'>
                                                                Add
                                                            </Button>
                                                            ) : (
                                                                <Button disabled variant='contained' color='primary'>
                                                                Out of Stock
                                                            </Button>
                                                            )
                                                        }
                                                        
                                                    </div>
                                                  ))
                                           }
                                        </div> */}
                                    </CardContent>
                           
                                </Card>
                            ))}
                        </div>
                    </Paper>
                </Grid>
                
            </Grid>
        </div>
    );
};

export default POS;