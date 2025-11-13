
import React from 'react';
import { Student } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';

interface StudentCardProps {
    student: Student;
    onEdit: (student: Student) => void;
    onDelete: (id: string) => void;
}

const departmentColors: Record<string, string> = {
    'Computer Science': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'Mechanical': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'Civil': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'Electrical': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'Information Science': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'Electronics': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
};

const StudentCard: React.FC<StudentCardProps> = ({ student, onEdit, onDelete }) => {
    const getMarksColor = (marks: number) => {
        if (marks >= 90) return 'text-green-500';
        if (marks >= 75) return 'text-blue-500';
        if (marks >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <div className="p-5">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{student.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{student.usn}</p>
                    </div>
                    <div className={`text-3xl font-bold ${getMarksColor(student.marks)}`}>
                        {student.marks}
                        <span className="text-sm text-gray-400">/100</span>
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <AcademicCapIcon className="w-5 h-5 mr-2 text-gray-400" />
                        <span>Semester {student.semester}</span>
                    </div>
                     <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <ClipboardListIcon className="w-5 h-5 mr-2 text-gray-400" />
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${departmentColors[student.department] || departmentColors['Mechanical']}`}>
                            {student.department}
                        </span>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3 flex justify-end items-center gap-3">
                <button
                    onClick={() => onEdit(student)}
                    className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                    aria-label="Edit student"
                >
                    <PencilIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onDelete(student.id)}
                    className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                    aria-label="Delete student"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default StudentCard;
