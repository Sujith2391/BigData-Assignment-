
import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { XIcon } from './icons/XIcon';

interface StudentFormModalProps {
    student: Student | null;
    onClose: () => void;
    onSave: (studentData: Omit<Student, 'id'> | Student) => void;
}

const StudentFormModal: React.FC<StudentFormModalProps> = ({ student, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        usn: '',
        marks: 0,
        semester: 1,
        department: 'Computer Science',
    });
    
    useEffect(() => {
        if (student) {
            setFormData({
                name: student.name,
                usn: student.usn,
                marks: student.marks,
                semester: student.semester,
                department: student.department,
            });
        }
    }, [student]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'marks' || name === 'semester' ? parseInt(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (student) {
            onSave({ ...student, ...formData });
        } else {
            onSave(formData);
        }
    };
    
    const departments = ['Computer Science', 'Mechanical', 'Civil', 'Electrical', 'Information Science', 'Electronics'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md transform transition-all">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{student ? 'Edit Student' : 'Add New Student'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                        </div>
                        <div>
                            <label htmlFor="usn" className="block text-sm font-medium text-gray-700 dark:text-gray-300">USN</label>
                            <input type="text" name="usn" id="usn" value={formData.usn} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="marks" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Marks</label>
                                <input type="number" name="marks" id="marks" min="0" max="100" value={formData.marks} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                            </div>
                            <div>
                                <label htmlFor="semester" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Semester</label>
                                <input type="number" name="semester" id="semester" min="1" max="8" value={formData.semester} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                            <select id="department" name="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                                {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentFormModal;
