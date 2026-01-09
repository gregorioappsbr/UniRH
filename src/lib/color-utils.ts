
const feminineColors = [
  'bg-rose-200 dark:bg-rose-800/20',
  'bg-pink-200 dark:bg-pink-800/20',
  'bg-fuchsia-200 dark:bg-fuchsia-800/20',
  'bg-purple-200 dark:bg-purple-800/20',
  'bg-violet-200 dark:bg-violet-800/20',
];

const masculineColors = [
  'bg-blue-200 dark:bg-blue-800/20',
  'bg-green-200 dark:bg-green-800/20',
  'bg-cyan-200 dark:bg-cyan-800/20',
  'bg-teal-200 dark:bg-teal-800/20',
  'bg-indigo-200 dark:bg-indigo-800/20',
];

const neutralColors = [
  'bg-yellow-200 dark:bg-yellow-800/20',
  'bg-orange-200 dark:bg-orange-800/20',
  'bg-amber-200 dark:bg-amber-800/20',
  'bg-lime-200 dark:bg-lime-800/20',
  'bg-sky-200 dark:bg-sky-800/20',
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
