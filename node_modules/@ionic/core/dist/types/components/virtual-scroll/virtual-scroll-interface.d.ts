export declare const enum CellType {
    Item = 0,
    Header = 1,
    Footer = 2
}
export declare const enum NodeChange {
    NoChange = 0,
    Position = 1,
    Cell = 2
}
export interface Cell {
    i: number;
    index: number;
    value: any;
    type: CellType;
    height: number;
    reads: number;
    visible: boolean;
}
export interface VirtualNode {
    cell: Cell;
    top: number;
    change: NodeChange;
    d: boolean;
    visible: boolean;
}
export declare type HeaderFn = (item: any, index: number, items: any[]) => string | null | undefined;
export declare type ItemHeightFn = (item: any, index: number) => number;
export declare type ItemRenderFn = (el: HTMLElement | null, cell: Cell, domIndex: number) => HTMLElement;
export declare type DomRenderFn = (dom: VirtualNode[]) => void;
