declare const _default: {
    'join': (v: any[], arg: string) => string;
    'last': <T>(v: T[]) => T;
    'first': <T>(v: T[]) => T;
    'map': <T1, T2>(arr: {
        [key: string]: T1;
    }[], arg: string) => T1[];
    'reverse': (v: any[]) => any[];
    'sort': <T>(v: T[], arg: (lhs: T, rhs: T) => number) => T[];
    'size': (v: string | any[]) => number;
    'concat': <T1, T2>(v: T1[], arg: T2 | T2[]) => (T1 | T2)[];
    'slice': <T>(v: T[], begin: number, length: number) => T[];
    'uniq': <T>(arr: T[]) => T[];
};
export default _default;
