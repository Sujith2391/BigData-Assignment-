import React from 'react';
import Header from './Header';
import { PencilSquareIcon } from './icons/PencilSquareIcon';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { SparklesIcon } from './icons/SparklesIcon';


interface LandingPageProps {
    onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Header />

            {/* Hero Section */}
            <main className="container mx-auto px-6 py-16 text-center">
                <h2 className="text-4xl font-bold md:text-5xl lg:text-6xl text-gray-900 dark:text-white">
                    A Modern Solution for Student Management
                </h2>
                <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Streamline student record-keeping with our intuitive and powerful management system. Featuring advanced filtering, data visualization, and AI-powered insights.
                </p>
                <button
                    onClick={onGetStarted}
                    className="mt-8 px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
                >
                    Launch Dashboard
                </button>
            </main>

            {/* Features Section */}
            <section id="features" className="bg-white dark:bg-gray-800 py-20">
                <div className="container mx-auto px-6">
                    <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Key Features</h3>
                    <p className="text-center text-gray-500 dark:text-gray-400 mt-2 mb-12">
                        Everything you need to manage student data effectively.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg shadow-sm text-center">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4 mx-auto">
                                <PencilSquareIcon className="w-7 h-7" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Full CRUD Operations</h4>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Easily create, read, update, and delete student records through an intuitive modal interface.</p>
                        </div>
                        {/* Feature 2 */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg shadow-sm text-center">
                             <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mb-4 mx-auto">
                                <MagnifyingGlassIcon className="w-7 h-7" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Advanced Search & Filter</h4>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Dynamically filter by department, search by name/USN, and adjust mark ranges with a slider.</p>
                        </div>
                        {/* Feature 3 */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg shadow-sm text-center">
                             <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4 mx-auto">
                                <ChartBarIcon className="w-7 h-7" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Data Aggregation</h4>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Visualize semester-wise performance with an interactive bar chart, demonstrating powerful data aggregation.</p>
                        </div>
                        {/* Feature 4 */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg shadow-sm text-center">
                             <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mb-4 mx-auto">
                                <SparklesIcon className="w-7 h-7" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">AI-Powered Reports</h4>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Leverage the Gemini API to generate comprehensive, insightful performance reports from student data.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Footer */}
            <footer className="bg-gray-100 dark:bg-gray-900">
                <div className="container mx-auto px-6 py-8">
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} Student Record Management System. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
