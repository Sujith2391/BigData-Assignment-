
import React from 'react';
import { AggregationResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AggregationViewProps {
    data: AggregationResult[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
        <p className="font-bold text-gray-800 dark:text-gray-200">{`Semester ${label}`}</p>
        <p className="text-sm text-blue-600 dark:text-blue-400">{`Average Marks: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};


const AggregationView: React.FC<AggregationViewProps> = ({ data }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Semester Performance Analysis</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Average marks grouped by semester. This demonstrates a mock aggregation pipeline.</p>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={data}
                        margin={{
                            top: 5, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                        <XAxis dataKey="_id" name="Semester" unit="" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                        <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} domain={[0, 100]} />
                        <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(200,200,200,0.1)'}}/>
                        <Legend wrapperStyle={{ color: '#9ca3af' }} />
                        <Bar dataKey="averageMarks" fill="#4f46e5" name="Average Marks" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
             <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">Aggregation Pipeline Breakdown</h4>
                <ol className="list-decimal list-inside mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li><strong className="text-gray-700 dark:text-gray-300">$group:</strong> Student records are grouped by the `semester` field.</li>
                    <li><strong className="text-gray-700 dark:text-gray-300">$avg:</strong> For each group, the average of the `marks` field is calculated.</li>
                    <li><strong className="text-gray-700 dark:text-gray-300">$sort:</strong> The final results are sorted by semester number in ascending order.</li>
                </ol>
            </div>
        </div>
    );
};

export default AggregationView;
