export class ResponsiveConfig {
    static sideList = `hidden lg:flex w-64 2xl:w-96`;
    static postPage = `lg:ml-64 2xl:ml-96`;
    static post = `w-11/12 lg:w-2/3 2xl:w-1/2`;
    static hamburger = `lg:hidden`;
    static hamburgerBtn = `w-8 h-8 md:w-10 md:h-10`
    static themeGridLayout = `w-11/12 grid-cols-1 sm:grid-cols-2 xl:w-3/4 2xl:grid-cols-3 2xl:w-2/3`;
    static themeH1 = `text-xl md:text:2xl font-bold lg:text-3xl`;
    static themeH2 = `text-lg font-bold lg:text-xl`;
    static nav = `text-xl h-12 md:h-14 md:text-2xl`;
    static accordion = `text-sm sm:text-base`;
    static accordionDot = `w-1.5 h-1.5 sm:w-2 sm:h-2`;
}

export class ZIndexConfig {
    static hamburgerBtn = `z-50`;
    static rightList = `z-40`;
    static hamburgerBackground = `z-30`;
    static nav = `z-20`;
    static sideList = `z-10`;
    static post = `z-0`;
}

export class ColorConfig {
    static root = `bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50`;
    static nav = `bg-slate-50/30 dark:bg-slate-900/30 border-b-slate-300 dark:border-b-slate-600`;
    static theme = `border-slate-300 dark:border-slate-600`;
    static sideList = `border-r-slate-300 dark:border-r-slate-600`;
    static pointText = `text-blue-600 dark:text-cyan-400`;
    static hover = `hover:bg-slate-300 dark:hover:bg-slate-600`;
    static accordionDot = `bg-slate-900 dark:bg-slate-50`;
    static accordionItem = `
    border-l-slate-300 dark:border-l-slate-600
    hover:text-blue-600 dark:hover:text-cyan-400
    hover:border-blue-600 dark:hover:border-cyan-400`;
    static code = `bg-slate-300 border border-slate-400 dark:bg-slate-600 dark:border-slate-500`;
    static hamburgerBackground = `bg-slate-50/70 dark:bg-slate-900/70`;
    static bottomNav = `border-t-slate-300 dark:border-t-slate-600`;
}