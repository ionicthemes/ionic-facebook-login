export declare type Knob = 'A' | 'B' | undefined;
export declare type RangeValue = number | {
    lower: number;
    upper: number;
};
export interface RangeEventDetail extends Event {
    isIncrease: boolean;
    knob: Knob;
}
