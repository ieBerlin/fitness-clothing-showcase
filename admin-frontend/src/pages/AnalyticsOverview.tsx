import React from 'react';

const AnalyticsOverview: React.FC = () => {
    // Dummy data for demonstration
    const productPerformance = [
        { name: 'Winter Jacket', sales: 150, revenue: '$18,000' },
        { name: 'Summer Dress', sales: 200, revenue: '$12,000' },
    ];

    const adminActivities = [
        { activity: 'Added new product "Winter Jacket"', date: '2024-08-27' },
        { activity: 'Updated product "Summer Dress"', date: '2024-08-26' },
    ];

    const trackChanges = [
        { change: 'Changed price of "Winter Jacket" from $100 to $120', date: '2024-08-25' },
        { change: 'Added new color option "Red" for "Summer Dress"', date: '2024-08-24' },
    ];

    const handleExport = () => {
        // Logic for exporting data
        console.log('Exporting product data...');
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">Analytics Overview</h1>

                {/* Product Performance Section */}
                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Performance</h2>
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-2 text-left">Product</th>
                                <th className="p-2 text-left">Sales</th>
                                <th className="p-2 text-left">Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productPerformance.map((item, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="p-2">{item.name}</td>
                                    <td className="p-2">{item.sales}</td>
                                    <td className="p-2">{item.revenue}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* Admin Activities Log Section */}
                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Admin Activities Log</h2>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 shadow-md">
                        <ul className="space-y-2">
                            {adminActivities.map((activity, index) => (
                                <li key={index} className="text-gray-700">
                                    <span className="font-medium">{activity.activity}</span> on {activity.date}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Track Changes Section */}
                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Track Changes Made by Admins</h2>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 shadow-md">
                        <ul className="space-y-2">
                            {trackChanges.map((change, index) => (
                                <li key={index} className="text-gray-700">
                                    <span className="font-medium">{change.change}</span> on {change.date}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Export Data Section */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Export Data</h2>
                    <button
                        onClick={handleExport}
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        Export Product Data
                    </button>
                </section>
            </div>
        </div>
    );
};

export default AnalyticsOverview;
