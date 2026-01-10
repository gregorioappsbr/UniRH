
const feminineColors = [
    'bg-pink-400/80',
    'bg-fuchsia-400/80',
    'bg-violet-400/80',
    'bg-rose-400/80',
    'bg-red-400/80',
    'bg-orange-400/80',
    'bg-amber-400/80',
    'bg-yellow-400/80',
];

const masculineColors = [
    'bg-sky-400/80',
    'bg-blue-400/80',
    'bg-cyan-400/80',
    'bg-teal-400/80',
    'bg-emerald-400/80',
    'bg-green-400/80',
    'bg-indigo-400/80',
    'bg-gray-400/80',
];

const neutralColors = [
    'bg-lime-400/80',
    'bg-slate-400/80',
    'bg-stone-400/80',
    'bg-purple-400/80',
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
