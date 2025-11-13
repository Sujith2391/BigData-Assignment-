import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Student, SortOrder, AggregationResult, Toast } from '../types';
import * as studentService from '../services/studentService';
import Header from './Header';
import StudentList from './StudentList';
import StudentFormModal from './StudentFormModal';
import AggregationView from './AggregationView';
import SkeletonCard from './SkeletonCard';
import ToastComponent from './Toast';
import Pagination from './Pagination';
import ReportModal from './ReportModal';
import { PlusIcon } from './icons/PlusIcon';
import { DatabaseIcon } from './icons/DatabaseIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { SparklesIcon } from './icons/SparklesIcon';

const API_KEY = process.env.API_KEY;
const DEPARTMENTS = ['All', 'Computer Science', 'Mechanical', 'Civil', 'Electrical', 'Information Science', 'Electronics'];
const STUDENTS_PER_PAGE = 6;

interface DashboardProps {
    onNavigateHome: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigateHome }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    
    const [marksRange, setMarksRange] = useState<{ min: number; max: number }>({ min: 0, max: 100 });
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [departmentFilter, setDepartmentFilter] = useState<string>('All');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);

    const [aggregationData, setAggregationData] = useState<AggregationResult[]>([]);
    const [showAggregation, setShowAggregation] = useState<boolean>(false);

    const [toasts, setToasts] = useState<Toast[]>([]);

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportContent, setReportContent] = useState('');
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    const addToast = (message: string, type: 'success' | 'error') => {
        setToasts(prev => [...prev, { id: Date.now(), message, type }]);
    };

    const fetchStudents = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, total } = await studentService.getStudents({
                marksRange,
                sort: sortOrder,
                search: searchQuery,
                department: departmentFilter,
                page: currentPage,
                limit: STUDENTS_PER_PAGE,
            });
            setStudents(data);
            setTotalPages(Math.ceil(total / STUDENTS_PER_PAGE));
        } catch (err) {
            setError('Failed to fetch students. Please try again.');
            addToast('Failed to fetch students.', 'error');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [marksRange, sortOrder, searchQuery, departmentFilter, currentPage]);
    
    useEffect(() => {
        studentService.initializeDatabase();
        fetchStudents();
    }, [fetchStudents]);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [marksRange, sortOrder, searchQuery, departmentFilter]);


    const handleOpenModal = (student: Student | null = null) => {
        setEditingStudent(student);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStudent(null);
    };

    const handleSaveStudent = async (studentData: Omit<Student, 'id'> | Student) => {
        try {
            if ('id' in studentData) {
                await studentService.updateStudent(studentData.id, studentData);
                addToast('Student updated successfully!', 'success');
            } else {
                await studentService.createStudent(studentData);
                addToast('Student added successfully!', 'success');
            }
            fetchStudents();
            handleCloseModal();
        } catch (err) {
            addToast('Failed to save student.', 'error');
            console.error(err);
        }
    };

    const handleDeleteStudent = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this student record?')) {
            try {
                await studentService.deleteStudent(id);
                addToast('Student deleted successfully.', 'success');
                fetchStudents();
            } catch (err) {
                addToast('Failed to delete student.', 'error');
                console.error(err);
            }
        }
    };

    const handleResetDatabase = () => {
        if (window.confirm('Are you sure you want to reset the database? This will restore the initial data.')) {
            studentService.resetDatabase();
            addToast('Database has been reset.', 'success');
            setSearchQuery('');
            setDepartmentFilter('All');
            setSortOrder('asc');
            setMarksRange({min: 0, max: 100});
            setCurrentPage(1);
            // Refetch students with default settings
            fetchStudents();
        }
    };
    
    const handleToggleAggregation = async () => {
        if (!showAggregation) {
            try {
                const data = await studentService.getAverageMarksBySemester();
                setAggregationData(data);
                setShowAggregation(true);
            } catch (err) {
                addToast('Failed to fetch aggregation data.', 'error');
                console.error(err);
            }
        } else {
            setShowAggregation(false);
        }
    };

    const handleGenerateReport = async () => {
        setIsGeneratingReport(true);
        setIsReportModalOpen(true);
        setReportContent('');

        try {
            if (!API_KEY) {
                throw new Error("API_KEY is not set");
            }
            const ai = new GoogleGenAI({ apiKey: API_KEY });

            const allStudents = await studentService.getAllStudentsForReport();
            if (allStudents.length === 0) {
                 setReportContent("There is no student data available to generate a report.");
                 setIsGeneratingReport(false);
                 return;
            }

            // Enhanced data analysis
            const markBrackets = {
                'Excellent (90-100)': allStudents.filter(s => s.marks >= 90).length,
                'Good (75-89)': allStudents.filter(s => s.marks >= 75 && s.marks < 90).length,
                'Average (50-74)': allStudents.filter(s => s.marks >= 50 && s.marks < 75).length,
                'Needs Improvement (<50)': allStudents.filter(s => s.marks < 50).length,
            };

            const departmentPerformance: { [key: string]: { totalMarks: number, count: number, average: number } } = {};
            allStudents.forEach(student => {
                if (!departmentPerformance[student.department]) {
                    departmentPerformance[student.department] = { totalMarks: 0, count: 0, average: 0 };
                }
                departmentPerformance[student.department].totalMarks += student.marks;
                departmentPerformance[student.department].count++;
            });
            Object.keys(departmentPerformance).forEach(dep => {
                departmentPerformance[dep].average = parseFloat((departmentPerformance[dep].totalMarks / departmentPerformance[dep].count).toFixed(2));
            });
            
            const summary = {
                totalStudents: allStudents.length,
                averageMark: (allStudents.reduce((acc, s) => acc + s.marks, 0) / allStudents.length).toFixed(2),
            };

            const prompt = `
                You are an expert academic analyst AI. Your task is to generate a comprehensive student performance report based on the provided data. The report should be insightful, well-structured, and easy for an educator to understand.

                **Input Data:**

                *   **Overall Summary:**
                    *   Total Students: ${summary.totalStudents}
                    *   Overall Average Mark: ${summary.averageMark}
                *   **Mark Distribution:**
            ${Object.entries(markBrackets).map(([bracket, count]) => `    *   ${bracket}: ${count} students`).join('\n')}
                *   **Performance by Department:**
            ${Object.entries(departmentPerformance).map(([dep, data]) => `    *   ${dep}: ${data.count} students, Average Mark: ${data.average}`).join('\n')}

                **Required Report Structure (Use Markdown):**

                Please generate a report with the following sections:

                ### 1. Executive Summary
                Provide a high-level overview of the class's performance. Mention the overall average and the total number of students.

                ### 2. Performance Distribution Analysis
                Analyze the distribution of marks across the different brackets (Excellent, Good, etc.). Comment on the proportion of high-achievers versus students who may need support.

                ### 3. Departmental Insights
                Compare the performance across different departments. Highlight any departments that are performing particularly well or any that might have a lower average. Avoid making definitive judgments, but point out the statistical differences.

                ### 4. Actionable Recommendations
                Based on your analysis, provide 2-3 concrete and actionable recommendations for the faculty. These could relate to teaching strategies, student support initiatives, or curriculum adjustments.

                **Formatting Guidelines:**
                *   Use Markdown for headings ('###'), bold text ('**text**'), and unordered lists ('- ').
                *   Keep the tone professional, objective, and constructive.
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setReportContent(response.text);

        } catch (error) {
            console.error("Error generating report:", error);
            setReportContent("Sorry, there was an error generating the report. Please check the console for details.");
            addToast('Failed to generate report.', 'error');
        } finally {
            setIsGeneratingReport(false);
        }
    };

    return (
        <>
            <div className="fixed top-4 right-4 z-[100] w-full max-w-xs space-y-3">
                {toasts.map(toast => (
                    <ToastComponent key={toast.id} toast={toast} onDismiss={(id) => setToasts(p => p.filter(t => t.id !== id))} />
                ))}
            </div>

            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                <Header onNavigateHome={onNavigateHome} isDashboard={true} />
                <main className="container mx-auto p-4 md:p-6 lg:p-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Student Records</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Manage student information, filter by marks, and view analytics.</p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                 <button onClick={handleGenerateReport} className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                                    <SparklesIcon className="w-5 h-5 mr-2 -ml-1" />
                                    Generate Report
                                </button>
                                <button onClick={() => handleOpenModal()} className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
                                    Add Student
                                </button>
                                <button onClick={handleResetDatabase} className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
                                    <RefreshIcon className="w-5 h-5 mr-2 -ml-1" />
                                    Reset DB
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                            <div>
                                <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search by Name/USN</label>
                                <input
                                    id="search"
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="e.g., Alice Johnson or 1MS21CS001"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                />
                            </div>
                             <div>
                                <label htmlFor="department-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Department</label>
                                <select
                                    id="department-filter"
                                    value={departmentFilter}
                                    onChange={(e) => setDepartmentFilter(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                >
                                    {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                            <div className="md:col-span-1">
                                <label htmlFor="marks-range" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Marks Range: {marksRange.min} - {marksRange.max}</label>
                                <input
                                    id="marks-range"
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={marksRange.max}
                                    onChange={(e) => setMarksRange({ ...marksRange, max: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mt-1"
                                />
                            </div>
                            <div>
                                <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sort by Marks</label>
                                <select
                                    id="sort-order"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                >
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>
                            </div>
                            <div className="md:self-end">
                                <button onClick={handleToggleAggregation} className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <DatabaseIcon className="w-5 h-5 mr-2 -ml-1" />
                                    {showAggregation ? 'Hide' : 'Show'} Aggregation
                                </button>
                            </div>
                        </div>
                    </div>

                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

                    {showAggregation ? (
                        <AggregationView data={aggregationData} />
                    ) : (
                        <>
                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Array.from({ length: STUDENTS_PER_PAGE }).map((_, index) => (
                                        <SkeletonCard key={index} />
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <StudentList students={students} onEdit={handleOpenModal} onDelete={handleDeleteStudent} />
                                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                                </>
                            )}
                        </>
                    )}
                </main>
                {isModalOpen && <StudentFormModal student={editingStudent} onClose={handleCloseModal} onSave={handleSaveStudent} />}
                <ReportModal 
                    isOpen={isReportModalOpen} 
                    onClose={() => setIsReportModalOpen(false)}
                    content={reportContent}
                    isLoading={isGeneratingReport}
                />
            </div>
        </>
    );
};

export default Dashboard;
