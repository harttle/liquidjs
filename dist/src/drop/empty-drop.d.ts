import { Drop } from './drop';
import { IComparable } from './icomparable';
import { IDrop } from 'src/drop/idrop';
export declare class EmptyDrop extends Drop implements IDrop, IComparable {
    equals(value: any): boolean;
    gt(): boolean;
    geq(): boolean;
    lt(): boolean;
    leq(): boolean;
    value(): string;
}
