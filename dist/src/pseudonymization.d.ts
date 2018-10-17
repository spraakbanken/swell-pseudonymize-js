/** A store of pseudonyms, indexed by type and variable index. */
export declare const variableMapping: {
    [type: string]: string[];
};
export declare const usedForType: {
    [key: string]: any;
};
export declare function pseudonymize(s: string, labels: string[]): string;
export declare const anonymization: {
    [key: string]: (type: string, labels: string[], s: string) => string;
};
