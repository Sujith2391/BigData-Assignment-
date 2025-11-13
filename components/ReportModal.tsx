
import React from 'react';
import { XIcon } from './icons/XIcon';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: string;
    isLoading: boolean;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, content, isLoading }) => {
    if (!isOpen) return null;
    
    // A simple markdown to HTML converter that processes line-by-line
    const formatContent = (text: string) => {
        if (!text) return '';
        const lines = text.split('\n');
        let html = '';
        let inList = false;
        let listType = ''; // 'ul' or 'ol'

        lines.forEach(line => {
            // Headings
            if (line.startsWith('### ')) {
                if (inList) { html += `</${listType}>`; inList = false; }
                html += `<h3 class="text-lg font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-100">${line.substring(4)}</h3>`;
                return;
            }
            if (line.startsWith('## ')) {
                if (inList) { html += `</${listType}>`; inList = false; }
                html += `<h2 class="text-xl font-bold mt-5 mb-2 text-gray-800 dark:text-gray-100">${line.substring(3)}</h2>`;
                return;
            }

            // Unordered List
            if (line.startsWith('- ') || line.startsWith('* ')) {
                if (!inList || listType !== 'ul') {
                    if(inList) html += `</${listType}>`;
                    inList = true;
                    listType = 'ul';
                    html += `<ul class="list-disc list-inside space-y-1 my-2 text-gray-600 dark:text-gray-300">`;
                }
                let item = line.substring(2);
                item = item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                html += `<li>${item}</li>`;
                return;
            }
            
            // Ordered List
            if (line.match(/^\d+\. /)) {
                 if (!inList || listType !== 'ol') {
                    if(inList) html += `</${listType}>`;
                    inList = true;
                    listType = 'ol';
                    html += `<ol class="list-decimal list-inside space-y-1 my-2 text-gray-600 dark:text-gray-300">`;
                }
                let item = line.replace(/^\d+\. /, '');
                item = item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                html += `<li>${item}</li>`;
                return;
            }

            // End of list if a non-list line is found
            if (inList && line.trim() !== '') {
                html += `</${listType}>`;
                inList = false;
            }

            // Paragraphs and other text
            if (line.trim() !== '') {
                let p = line;
                p = p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                html += `<p class="text-gray-600 dark:text-gray-300 leading-relaxed">${p}</p>`;
            }
        });

        if (inList) {
            html += `</${listType}>`;
        }
        
        return html;
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl transform transition-all max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Performance Report</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-48">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                            <p className="mt-4 text-gray-500 dark:text-gray-400">Generating report, please wait...</p>
                        </div>
                    ) : (
                         <div className="text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: formatContent(content) }} />
                    )}
                </div>
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end mt-auto">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
