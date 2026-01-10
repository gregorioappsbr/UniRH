
const feminineColors = [
    'bg-pink-500/80 dark:bg-pink-500/60',
    'bg-fuchsia-500/80 dark:bg-fuchsia-500/60',
    'bg-purple-500/80 dark:bg-purple-500/60',
    'bg-violet-500/80 dark:bg-violet-500/60',
    'bg-red-500/80 dark:bg-red-500/60',
    'bg-rose-500/80 dark:bg-rose-500/60',
    'bg-orange-500/80 dark:bg-orange-500/60',
    'bg-yellow-500/80 dark:bg-yellow-500/60',
];

const masculineColors = [
    'bg-sky-500/80 dark:bg-sky-500/60',
    'bg-blue-500/80 dark:bg-blue-500/60',
    'bg-cyan-500/80 dark:bg-cyan-500/60',
    'bg-teal-500/80 dark:bg-teal-500/60',
    'bg-emerald-500/80 dark:bg-emerald-500/60',
    'bg-green-500/80 dark:bg-green-500/60',
    'bg-indigo-500/80 dark:bg-indigo-500/60',
    'bg-gray-500/80 dark:bg-gray-500/60',
];

const neutralColors = [
    'bg-lime-500/80 dark:bg-lime-500/60',
    'bg-slate-500/80 dark:bg-slate-500/60',
    'bg-stone-500/80 dark:bg-stone-500/60',
    'bg-amber-500/80 dark:bg-amber-500/60',
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
