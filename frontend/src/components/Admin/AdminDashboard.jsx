import React, { useEffect, useState } from 'react';
import { Breadcrumbs, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
// import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import Search from './Search';
import graph from '../../pages/graph.png';
import graph2 from '../../pages/graph2.png';
import graph3 from '../../pages/graph3.png';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const AdminDashboard = () => {
 

  const [orders, setOrders] = useState([]);
  const barChartData = {
    labels: ['Saree', 'Kurti', 'Dresses','Tops','Jeans', 'Shirts', 'Trousers'],
    data: [12, 19, 3,7,14, 5, 7],
  };



  useEffect(() => {
    // Fetch the dashboard data from the server
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/api/dashboard`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
          }
        });
        setDashboardData({
          ...dashboardData,
          ...response.data
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    
    fetchOrders();
    

    fetchDashboardData();
  }, []);



  const fetchOrders = async () => {
    // Fetch orders from the server
    const response = await axios.get('http://localhost:3000/api/orders/getorders');
    console.log(response.data);

    setOrders(response.data.map((order) => ({
        id: `#${order.id.slice(0,6).toUpperCase()}`,
        customer: order.name,
        email: order.email,
        phoneNumber: order.phoneNumber,
        status: order.status,
        items: order.items,
        total: `Rs${order.totalAmount.toFixed(2)}`,
        CreatedAt: order.createdAt,
        user: order.user,
    })));
}




const [dashboardData, setDashboardData] = useState({
  users: { count: 14, growth:24 },
  orders: { count:   12, growth: -12 },
  revenue: { count: 12, growth: 22 },
  recentOrders: [],
  ordersChartData: {}
});


  const breadcrumbs = [
    <Link key="1" color="inherit" to="/">
      Home
    </Link>,
    <Link key="2" color="inherit" to="/material-ui/getting-started/installation/">
      Admin
    </Link>,
    <Typography key="3" color="textPrimary">
      Dashboard
    </Typography>,
  ];

  return (
    <div className='w-full flex h-[calc(100vh_-_8vh)] mx-auto flex-col p-5'>
      <div className='flex flex-col justify-between gap-3 mb-5 -mt-9'>
        <div className='flex justify-between'>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
          <div className='flex gap-3 items-center'>
            <Search />
            <div className='rounded-lg border-2 p-1 border-gray-200 bg-gray-300'>
              {/* <NotificationsRoundedIcon /> */}
            </div>
          </div>
        </div>
        <h1 className='text-xl font-semibold'>Dashboard</h1>
      </div>
      <div className='w-full relative flex flex-col items-between justify-start border-gray-300 h-full rounded-lg'>
        <div className='w-full flex flex-row gap-4 mb-6'>
          <DashboardCard
            title="Users"
            count={dashboardData.users.count}
            growth={dashboardData.users.growth}
            graph={graph}
          />
          <DashboardCard
            title="Orders"
            count={orders.length}
            growth={dashboardData.orders.growth}
            graph={graph2}
          />
          <DashboardCard
            title="Revenue"
            count='Rs 1,22,438'
            growth={dashboardData.revenue.growth}
            graph={graph3}
          />
           <DashboardCard
            title="Sales"
            count={dashboardData.revenue.count}
            growth={dashboardData.revenue.growth}
            graph={graph}
          />
        </div>

        {/* Orders Bar Chart */}
        <div className='
          flex flex-row justify-between w-full gap-5
        '>


        <OrdersBarChart data={barChartData} />

        {/* Recent Orders */}
        <RecentOrders orders={orders} />
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, count, growth, graph }) => (
  <div className='w-1/4 max-w-[350px] p-3 font-semibold justify-start items-left flex flex-col h-[170px] border-2 border-neutral-300 rounded-lg gap-3'>
    <p className='text-left'>{title}</p>
    <div className='flex flex-row justify-between'>
      <div>
        <h1 className='text-2xl'>{count}</h1>
        <p className='text-gray-500 font-normal text-sm'>Last 30 Days</p>
      </div>
      <p className={`px-2 h-fit text-sm rounded-full border-2 ${growth > 0 ? 'text-green-600' : 'text-red-600'} border-gray-200`}>
        {growth > 0 ? `+${growth}%` : `${growth}%`}
      </p>
    </div>
    <img src={graph} alt={`${title} graph`} className='w-[100%] h-[70px] object-cover mb-10' />
  </div>
);

const OrdersBarChart = ({ data }) => {
  const chartData = {
    labels: data.labels || [],
    datasets: [
      {
        data: data.data || [],
        backgroundColor: data.colors || [
          '#0059b3',
          // 'rgba(255, 99, 132, 0.6)',
          // 'rgba(255, 206, 86, 0.6)',
          // 'rgba(54, 162, 235, 0.6)',
          // 'rgba(153, 102, 255, 0.6)',
          // 'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: data.borderColors || [
          '#0059b3',
          // 'rgba(255, 99, 132, 1)',
          // 'rgba(255, 206, 86, 1)',
          // 'rgba(54, 162, 235, 1)',
          // 'rgba(153, 102, 255, 1)',
          // 'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className='w-1/2 mb-6'>
      <h2 className='text-lg font-semibold mb-4'>Sales Overview</h2>
      <div className='bg-white p-4 rounded-lg w-full shadow-md'>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            scales: {
              x: {
                beginAtZero: true,
              },
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

const RecentOrders = ({ orders }) => (
  <div className='w-1/2 mb-6'>
    <h2 className='text-lg font-semibold mb-4'>Recent Orders</h2>
    <div className='bg-white p-4 rounded-lg shadow-md'>
      <table className='min-w-full bg-white'>
        <thead>
          <tr>
            <th className='py-2 px-4 border-b'>Order ID</th>
            <th className='py-2 px-4 border-b'>Customer</th>
            <th className='py-2 px-4 border-b'>Date</th>
            <th className='py-2 px-4 border-b'>Total</th>
            <th className='py-2 px-4 border-b'>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.sort((a,b)=>
            new Date(b.CreatedAt) - new Date(a.CreatedAt)).map((order, index) => (
            <tr key={index}>
              <td className='py-2 px-4 border-b'>{order.id}</td>
              <td className='py-2 px-4 border-b'>{order.customer}</td>
              <td className='py-2 px-4 border-b w-[300px]'>{
              new Date(order.CreatedAt).toLocaleDateString('en-US', { 
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
                
                }</td>
              <td className='py-2 px-4 border-b'>{order.total}</td>
              <td className='py-2 px-4 border-b'>
              {order.status === 'PENDING' ? (
                                                    <span className=' font-medium text-yellow-600 p-2 rounded-full'>Pending</span>
                                                ) : order.status === 'COMPLETED' ? (
                                                    <span className=' text-green-700 font-medium p-2 rounded-full'>Completed</span>
                                                ) : order.status === 'CANCELED' ? (
                                                    <span className='font-medium text-red-500 p-2 rounded-full'>Cancelled</span>
                                                ) :order.status === 'REFUNDED' ? (
                                                    <span className='font-medium text-purple-500 p-2 rounded-full'>Cancelled</span>
                                                ) :null
                                                    
                                                 }
                                                 </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminDashboard;
