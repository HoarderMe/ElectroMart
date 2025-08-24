import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Profile from './Profile';
import Orders from './Orders';

const UserDashboard = () => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState(
    location.pathname.includes('orders') ? 'orders' : 'profile'
  );

  const navigation = [
    { name: 'Profile', href: '/dashboard/profile', current: activeTab === 'profile' },
    { name: 'Orders', href: '/dashboard/orders', current: activeTab === 'orders' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile />;
      case 'orders':
        return <Orders />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Welcome back, {user?.firstName || 'User'}
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setActiveTab(item.name.toLowerCase())}
                      className={`
                        ${
                          item.current
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }
                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                      `}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="mt-6">
                {renderContent()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard; 