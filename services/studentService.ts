
import { Student, StudentQueryOptions, AggregationResult } from '../types';

let students: Student[] = [];

const SEED_DATA: Omit<Student, 'id'>[] = [
    { name: 'Alice Johnson', usn: '1MS21CS001', marks: 85, semester: 5, department: 'Computer Science' },
    { name: 'Bob Smith', usn: '1MS21ME010', marks: 72, semester: 5, department: 'Mechanical' },
    { name: 'Charlie Brown', usn: '1MS20CV020', marks: 91, semester: 7, department: 'Civil' },
    { name: 'Diana Prince', usn: '1MS21CS035', marks: 95, semester: 5, department: 'Computer Science' },
    { name: 'Ethan Hunt', usn: '1MS22EE005', marks: 68, semester: 3, department: 'Electrical' },
    { name: 'Fiona Glenanne', usn: '1MS20IS015', marks: 88, semester: 7, department: 'Information Science' },
    { name: 'George Costanza', usn: '1MS22CS050', marks: 45, semester: 3, department: 'Computer Science' },
    { name: 'Hannah Montana', usn: '1MS21EC025', marks: 78, semester: 5, department: 'Electronics' },
    { name: 'Isaac Newton', usn: '1MS20ME030', marks: 99, semester: 7, department: 'Mechanical' },
    { name: 'Jane Eyre', usn: '1MS22CV012', marks: 82, semester: 3, department: 'Civil' },
    { name: 'Kevin McCallister', usn: '1MS21IS008', marks: 65, semester: 5, department: 'Information Science' },
    { name: 'Luna Lovegood', usn: '1MS22CS060', marks: 92, semester: 3, department: 'Computer Science' },
];

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const initializeDatabase = (): void => {
    if (localStorage.getItem('students_db')) {
        students = JSON.parse(localStorage.getItem('students_db')!);
    } else {
        resetDatabase();
    }
};

export const resetDatabase = (): void => {
    students = SEED_DATA.map(s => ({ ...s, id: generateId() }));
    localStorage.setItem('students_db', JSON.stringify(students));
};

const persistData = () => {
    localStorage.setItem('students_db', JSON.stringify(students));
}

export const getStudents = async (options: StudentQueryOptions = {}): Promise<{ data: Student[], total: number }> => {
    await simulateDelay(500);
    let result = [...students];

    if (options.marksRange) {
        result = result.filter(s => s.marks >= options.marksRange!.min && s.marks <= options.marksRange!.max);
    }

    if (options.search) {
        const searchTerm = options.search.toLowerCase();
        result = result.filter(s => 
            s.name.toLowerCase().includes(searchTerm) || 
            s.usn.toLowerCase().includes(searchTerm)
        );
    }

    if (options.department && options.department !== 'All') {
        result = result.filter(s => s.department === options.department);
    }

    if (options.sort) {
        result.sort((a, b) => {
            if (options.sort === 'asc') return a.marks - b.marks;
            return b.marks - a.marks;
        });
    }

    const total = result.length;
    
    const page = options.page || 1;
    const limit = options.limit || 6;
    const start = (page - 1) * limit;
    result = result.slice(start, start + limit);
    
    return { data: result, total };
};

export const getAllStudentsForReport = async (): Promise<Student[]> => {
    await simulateDelay(100);
    return [...students];
};


export const createStudent = async (studentData: Omit<Student, 'id'>): Promise<Student> => {
    await simulateDelay(200);
    const newStudent: Student = {
        ...studentData,
        id: generateId(),
    };
    students.push(newStudent);
    persistData();
    return newStudent;
};

export const updateStudent = async (id: string, updates: Partial<Student>): Promise<Student | null> => {
    await simulateDelay(200);
    const studentIndex = students.findIndex(s => s.id === id);
    if (studentIndex === -1) return null;
    
    students[studentIndex] = { ...students[studentIndex], ...updates };
    persistData();
    return students[studentIndex];
};

export const deleteStudent = async (id: string): Promise<boolean> => {
    await simulateDelay(200);
    const initialLength = students.length;
    students = students.filter(s => s.id !== id);
    persistData();
    return students.length < initialLength;
};

export const getAverageMarksBySemester = async (): Promise<AggregationResult[]> => {
    await simulateDelay(500);
    
    // Simulating $group and $avg
    const groupedBySemester = students.reduce((acc, student) => {
        const semester = student.semester;
        if (!acc[semester]) {
            acc[semester] = { totalMarks: 0, count: 0 };
        }
        acc[semester].totalMarks += student.marks;
        acc[semester].count++;
        return acc;
    }, {} as Record<number, { totalMarks: number; count: number }>);
    
    // Calculating average and formatting
    let result: AggregationResult[] = Object.entries(groupedBySemester).map(([semester, data]) => ({
        _id: parseInt(semester),
        averageMarks: parseFloat((data.totalMarks / data.count).toFixed(2)),
    }));

    // Simulating $sort
    result.sort((a, b) => a._id - b._id);
    
    return result;
};
