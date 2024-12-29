
type voidFunc = ()=>void
export const editorShortcutListener = ({save, cancel}: {save: voidFunc, cancel: voidFunc}) => {
    return (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Escape') {
            cancel();
            return
        } else if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            save();
            return
        }
    };
}