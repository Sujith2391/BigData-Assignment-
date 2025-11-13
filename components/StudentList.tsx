
import React from 'react';
import { Student } from '../types';
import StudentCard from './StudentCard';

interface StudentListProps {
    students: Student[];
    onEdit: (student: Student) => void;
    onDelete: (id: string) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onEdit, onDelete }) => {
    if (students.length === 0) {
        return (
            <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Student Records Found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Try adjusting your filters or add a new student.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map(student => (
                <StudentCard
                    key={student.id}
                    student={student}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default StudentList;
