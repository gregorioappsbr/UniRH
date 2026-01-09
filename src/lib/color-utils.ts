
const feminineColors = [
  'bg-rose-200 dark:bg-rose-900',
  'bg-pink-200 dark:bg-pink-900',
  'bg-fuchsia-200 dark:bg-fuchsia-900',
  'bg-purple-200 dark:bg-purple-900',
  'bg-violet-200 dark:bg-violet-900',
];

const masculineColors = [
  'bg-blue-200 dark:bg-blue-900',
  'bg-green-200 dark:bg-green-900',
  'bg-cyan-200 dark:bg-cyan-900',
  'bg-teal-200 dark:bg-teal-900',
  'bg-indigo-200 dark:bg-indigo-900',
];

const neutralColors = [
  'bg-yellow-200 dark:bg-yellow-900',
  'bg-orange-200 dark:bg-orange-900',
  'bg-amber-200 dark:bg-amber-900',
  'bg-lime-200 dark:bg-lime-900',
  'bg-sky-200 dark:bg-sky-900',
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
