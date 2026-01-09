
const feminineColors = [
  'bg-rose-200/50 dark:bg-rose-800/10',
  'bg-pink-200/50 dark:bg-pink-800/10',
  'bg-fuchsia-200/50 dark:bg-fuchsia-800/10',
  'bg-purple-200/50 dark:bg-purple-800/10',
  'bg-violet-200/50 dark:bg-violet-800/10',
];

const masculineColors = [
  'bg-blue-200/50 dark:bg-blue-800/10',
  'bg-green-200/50 dark:bg-green-800/10',
  'bg-cyan-200/50 dark:bg-cyan-800/10',
  'bg-teal-200/50 dark:bg-teal-800/10',
  'bg-indigo-200/50 dark:bg-indigo-800/10',
];

const neutralColors = [
  'bg-yellow-200/50 dark:bg-yellow-800/10',
  'bg-orange-200/50 dark:bg-orange-800/10',
  'bg-amber-200/50 dark:bg-amber-800/10',
  'bg-lime-200/50 dark:bg-lime-800/10',
  'bg-sky-200/50 dark:bg-sky-800/10',
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
