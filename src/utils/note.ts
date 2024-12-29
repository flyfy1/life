import { Note, SortOption } from '../types';

export const sortNotes = (sortOption: SortOption, notesToSort: Note[]) => {
    return [...notesToSort].sort((a, b) => {
        const timeA = new Date(a[sortOption.field] as string).getTime();
        const timeB = new Date(b[sortOption.field] as string).getTime();
        return sortOption.direction === 'desc' ? timeB - timeA : timeA - timeB;
    });
};
