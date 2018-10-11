export declare const variableMapping: {
    [key: string]: number[];
};
export declare const usedForType: {
    [key: string]: any;
};
export declare function pseudonymize(s: string, labels: string[]): string;
export declare const anonymization: {
    [key: string]: (type: string, labels: string[], s: string) => string;
};
