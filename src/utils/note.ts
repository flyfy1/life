import { Note } from '../types';

export const sortNotes = (sortField: keyof Note, sortDirction: string, notesToSort: Note[]) => {
    return [...notesToSort].sort((a, b) => {
        const timeA = new Date(a[sortField] as string).getTime();
        const timeB = new Date(b[sortField] as string).getTime();
        return sortDirction === 'desc' ? timeB - timeA : timeA - timeB;
    });
};
