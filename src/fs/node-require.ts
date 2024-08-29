export const requireResolve = (partial: string) => require.resolve(partial, { paths: ['.'] })
