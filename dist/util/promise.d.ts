export declare function mapSeries<T1, T2>(iterable: T1[], iteratee: (item: T1, idx: number, iterable: T1[]) => Promise<T2> | T2): Promise<T2[]>;
