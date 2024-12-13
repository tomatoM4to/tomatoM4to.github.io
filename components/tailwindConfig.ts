export class ResponsiveConfig {
    static sideList = `hidden lg:flex w-64 2xl:w-96`;
    static postPage = `lg:ml-64 2xl:ml-96`;
    static post = `w-11/12 lg:w-2/3 2xl:w-1/2`;
    static hamburger = `lg:hidden`;
    static hamburgerBtn = `w-8 h-8 md:w-10 md:h-10`
    static themeGridLayout = `w-11/12 grid-cols-1 md:grid-cols-2 xl:w-3/4 2xl:grid-cols-3 2xl:w-2/3`;
    static themeH1 = `text-xl md:text:2xl font-bold lg:text-3xl`;
    static themeH2 = `text-lg font-bold lg:text-xl`;
    static nav = `text-xl h-12 md:h-14 md:text-2xl`
}

export class ZIndexConfig {
    static hamburgerBtn = `z-50`;
    static rightList = `z-40`;
    static hamburgerBackground = `z-30`;
    static nav = `z-20`;
    static sideList = `z-10`;
    static post = `z-0`;
}