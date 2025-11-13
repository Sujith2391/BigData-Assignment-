
export interface Student {
    id: string;
    name: string;
    usn: string; // University Seat Number
    marks: number;
    semester: number;
    department: string;
}

export type SortOrder = 'asc' | 'desc';

export interface StudentQueryOptions {
    marksRange?: { min: number; max: number };
    sort?: SortOrder;
    search?: string;
    department?: string;
    page?: number;
    limit?: number;
}

export interface AggregationResult {
    _id: number; // Semester
    averageMarks: number;
}

export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error';
}
