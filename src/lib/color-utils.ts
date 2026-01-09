
const feminineColors = [
  'bg-rose-300 dark:bg-rose-900',
  'bg-pink-300 dark:bg-pink-900',
  'bg-fuchsia-300 dark:bg-fuchsia-900',
  'bg-purple-300 dark:bg-purple-900',
  'bg-violet-300 dark:bg-violet-900',
  'bg-red-300 dark:bg-red-900',
  'bg-orange-300 dark:bg-orange-900',
  'bg-yellow-300 dark:bg-yellow-900',
];

const masculineColors = [
  'bg-blue-300 dark:bg-blue-900',
  'bg-green-300 dark:bg-green-900',
  'bg-cyan-300 dark:bg-cyan-900',
  'bg-teal-300 dark:bg-teal-900',
  'bg-indigo-300 dark:bg-indigo-900',
  'bg-sky-300 dark:bg-sky-900',
  'bg-lime-300 dark:bg-lime-900',
  'bg-gray-300 dark:bg-gray-700',
];

const neutralColors = [
  'bg-amber-300 dark:bg-amber-900',
  'bg-emerald-300 dark:bg-emerald-900',
  'bg-stone-300 dark:bg-stone-800',
  'bg-slate-300 dark:bg-slate-800',
];

const allColors = [...feminineColors, ...masculineColors, ...neutralColors];

export const getServerColor = (server: any, index: number) => {
  const gender = server.genero?.toLowerCase();
  switch (gender) {
    case 'feminino':
      return feminineColors[index % feminineColors.length];
    case 'masculino':
      return masculineColors[index % masculineColors.length];
    default: // nao-binario, outro, nao-informar
      return allColors[index % allColors.length];
  }
};
