
const feminineColors = [
    'bg-pink-500/80',
    'bg-fuchsia-500/80',
    'bg-violet-500/80',
    'bg-rose-500/80',
    'bg-red-500/80',
    'bg-orange-500/80',
    'bg-amber-500/80',
    'bg-yellow-500/80',
];

const masculineColors = [
    'bg-sky-500/80',
    'bg-blue-500/80',
    'bg-cyan-500/80',
    'bg-teal-500/80',
    'bg-emerald-500/80',
    'bg-green-500/80',
    'bg-indigo-500/80',
    'bg-gray-500/80',
];

const neutralColors = [
    'bg-lime-500/80',
    'bg-slate-500/80',
    'bg-stone-500/80',
    'bg-purple-500/80',
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
