export type Intersection<T1, T2> = Pick<T1, keyof T1 & keyof T2>;
