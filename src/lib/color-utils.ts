
const solidColors = [
    'bg-rose-200 dark:bg-rose-900',
    'bg-sky-200 dark:bg-sky-900',
    'bg-lime-200 dark:bg-lime-900',
    'bg-amber-200 dark:bg-amber-900',
    'bg-fuchsia-200 dark:bg-fuchsia-900',
    'bg-cyan-200 dark:bg-cyan-900',
    'bg-emerald-200 dark:bg-emerald-900',
    'bg-violet-200 dark:bg-violet-900',
    'bg-teal-200 dark:bg-teal-900',
    'bg-orange-200 dark:bg-orange-900',
    'bg-indigo-200 dark:bg-indigo-900',
    'bg-pink-200 dark:bg-pink-900',
];

export const getServerColor = (_server: any, index: number) => {
  return solidColors[index % solidColors.length];
};
