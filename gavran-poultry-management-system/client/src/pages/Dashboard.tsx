import React from 'react';
import Layout from '../components/Layout';
import KpiCard from '../components/ui/KpiCard';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';

const Dashboard: React.FC = () => {
  // Dummy data for dashboard
  const kpiData = [
    { 
      title: 'Total Birds', 
      value: '12,540', 
      change: '+12.5%', 
      changeType: 'positive',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      title: 'Eggs Today', 
      value: '5,480', 
      change: '+3.2%', 
      changeType: 'positive',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      )
    },
    { 
      title: 'Incubators', 
      value: '18', 
      change: '+0.5%', 
      changeType: 'positive',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.547 6 6 0 01-3.86-.547l-2.387.477a2 2 0 00-1.022.547A10 10 0 0110.979 4v7.5a3 3 0 003 3m0 0v6.5a4 4 0 01-2.5 3.758M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.547 6 6 0 01-3.86-.547l-2.387.477a2 2 0 00-1.022.547A10 10 0 0110.979 4v7.5a3 3 0 003 3m0 0v6.5a4 4 0 01-2.5 3.758" />
        </svg>
      )
    },
    { 
      title: 'Total Sales', 
      value: '₹89,250', 
      change: '+8.3%', 
      changeType: 'positive',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const statData = [
    { 
      title: 'Egg Production Rate', 
      value: '92.5%', 
      trend: 5,
      subtitle: 'Daily average'
    },
    { 
      title: 'Mortality Rate', 
      value: '1.2%', 
      trend: -0.8,
      subtitle: 'Last week'
    },
    { 
      title: 'Feed Conversion', 
      value: '2.4:1', 
      trend: -0.2,
      subtitle: 'Efficiency ratio'
    },
    { 
      title: 'Incubation Success', 
      value: '95.2%', 
      trend: 3.1,
      subtitle: 'Last month'
    }
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your poultry farm management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, index) => (
          <KpiCard 
            key={index}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            changeType={kpi.changeType}
            icon={kpi.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statData.map((stat, index) => (
          <StatCard 
            key={index}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            subtitle={stat.subtitle}
            icon={(
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            )}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Batch {item} started</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Tasks</h2>
          <div className="space-y-4">
            {[1, 2].map((task) => (
              <div key={task} className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Feeding schedule for batch {task}</p>
                  <p className="text-sm text-gray-500">Tomorrow at 8:00 AM</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;