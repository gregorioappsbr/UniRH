
const feminineColors = [
    'bg-rose-200 dark:bg-rose-800',
    'bg-fuchsia-200 dark:bg-fuchsia-800',
    'bg-pink-200 dark:bg-pink-800',
    'bg-violet-200 dark:bg-violet-800',
    'bg-red-200 dark:bg-red-800',
    'bg-orange-200 dark:bg-orange-800',
    'bg-amber-200 dark:bg-amber-800',
];

const masculineColors = [
    'bg-sky-200 dark:bg-sky-800',
    'bg-blue-200 dark:bg-blue-800',
    'bg-cyan-200 dark:bg-cyan-800',
    'bg-teal-200 dark:bg-teal-800',
    'bg-emerald-200 dark:bg-emerald-800',
    'bg-green-200 dark:bg-green-800',
    'bg-indigo-200 dark:bg-indigo-800',
];

const neutralColors = [
    'bg-lime-200 dark:bg-lime-800',
    'bg-gray-200 dark:bg-gray-800',
    'bg-slate-200 dark:bg-slate-800',
    'bg-stone-200 dark:bg-stone-800',
];

export const getServerColor = (server: any, index: number) => {
    const genero = server?.genero?.toLowerCase();
    
    if (genero === 'feminino') {
        return feminineColors[index % feminineColors.length];
    }
    
    if (genero === 'masculino') {
        return masculineColors[index % masculineColors.length];
    }
    
    // For 'nao-binario', 'nao-informar', 'outro', or undefined
    return neutralColors[index % neutralColors.length];
};
