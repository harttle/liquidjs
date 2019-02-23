declare const _default: ({
    output: {
        file: string;
        name: string;
        format: string;
        sourcemap: boolean;
        banner: string;
    }[];
    external: string[];
    plugins: import("rollup").Plugin[];
    treeshake: {
        propertyReadSideEffects: boolean;
    };
    input: string;
} | {
    output: {
        file: string;
        name: string;
        format: string;
        sourcemap: boolean;
        banner: string;
    }[];
    plugins: any[];
    treeshake: {
        propertyReadSideEffects: boolean;
    };
    input: string;
    external?: undefined;
} | {
    output: {
        file: string;
        name: string;
        format: string;
        sourcemap: boolean;
    }[];
    plugins: any[];
    treeshake: {
        propertyReadSideEffects: boolean;
    };
    input: string;
    external?: undefined;
})[];
export default _default;
