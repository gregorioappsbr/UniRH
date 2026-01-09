
const feminineColors = [
    'bg-pink-500',
    'bg-fuchsia-500',
    'bg-rose-500',
    'bg-violet-500',
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
];

const masculineColors = [
    'bg-sky-500',
    'bg-blue-500',
    'bg-cyan-500',
    'bg-teal-500',
    'bg-emerald-500',
    'bg-green-500',
    'bg-indigo-500',
    'bg-gray-500',
];

const neutralColors = [
    'bg-lime-500',
    'bg-slate-500',
    'bg-stone-500',
    'bg-purple-500',
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
