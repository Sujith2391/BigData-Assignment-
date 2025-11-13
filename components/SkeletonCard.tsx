
import React from 'react';

const SkeletonCard: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-pulse">
            <div className="p-5">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                    <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                </div>

                <div className="mt-4 space-y-3">
                    <div className="flex items-center">
                        <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded-full mr-2"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                    </div>
                    <div className="flex items-center">
                        <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded-full mr-2"></div>
                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-full w-2/5"></div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3 flex justify-end items-center gap-3">
                <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
        </div>
    );
};

export default SkeletonCard;
