import React from 'react';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { HomeIcon } from './icons/HomeIcon';

interface HeaderProps {
    onNavigateHome?: () => void;
    isDashboard?: boolean;
}


const Header: React.FC<HeaderProps> = ({ onNavigateHome, isDashboard }) => {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
                 <div className="flex items-center">
                    <BookOpenIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Student Record Management System
                    </h1>
                </div>

                {isDashboard && (
                     <button onClick={onNavigateHome} className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
                        <HomeIcon className="w-5 h-5 mr-2 -ml-1" />
                        Home
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
