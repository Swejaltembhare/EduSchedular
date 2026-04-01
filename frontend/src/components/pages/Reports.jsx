import React, { useState } from 'react';

const Reports = ({ onClose }) => {
  const [reportConfig, setReportConfig] = useState({
    type: 'Faculty Performance',
    dateRange: 'Last 30 days',
    format: 'PDF'
  });

  const handleGenerateReport = () => {
    // Handle report generation
    console.log('Generating report:', reportConfig);
    alert(`Report (${reportConfig.type}) is being generated in ${reportConfig.format} format.`);
  };

  const quickReports = [
    { title: 'Faculty Workload Summary', description: 'Overview of faculty teaching hours and distribution' },
    { title: 'Classroom Utilization', description: 'Analysis of classroom usage and efficiency' },
    { title: 'Schedule Conflicts Report', description: 'List of detected scheduling conflicts' },
    { title: 'Attendance Analysis', description: 'Student attendance patterns and trends' }
  ];

  return (
    <div className="p-6">
        <div className="pt-24 text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
               Reports & Analytics
            </h1>
        </div>
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Quick Reports</h3>
          <div className="space-y-3">
            {quickReports.map((report, index) => (
              <button 
                key={index}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium">{report.title}</div>
                <div className="text-sm text-gray-600">{report.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Generate Custom Report</h3>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <select 
                  value={reportConfig.type}
                  onChange={(e) => setReportConfig({...reportConfig, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Faculty Performance</option>
                  <option>Room Utilization</option>
                  <option>Schedule Efficiency</option>
                  <option>Attendance Analysis</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select 
                  value={reportConfig.dateRange}
                  onChange={(e) => setReportConfig({...reportConfig, dateRange: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>This Semester</option>
                  <option>Custom Range</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <div className="flex space-x-4">
                {['PDF', 'Excel', 'CSV'].map((format) => (
                  <label key={format} className="flex items-center">
                    <input 
                      type="radio" 
                      name="format" 
                      value={format}
                      checked={reportConfig.format === format}
                      onChange={(e) => setReportConfig({...reportConfig, format: e.target.value})}
                      className="mr-2" 
                    />
                    {format}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={handleGenerateReport}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Generate Report
              </button>
              <button 
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;