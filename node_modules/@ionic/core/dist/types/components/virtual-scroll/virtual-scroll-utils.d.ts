import { Cell, HeaderFn, ItemHeightFn, ItemRenderFn, VirtualNode } from '../../interface';
export interface Viewport {
    top: number;
    bottom: number;
}
export interface Range {
    offset: number;
    length: number;
}
export declare function updateVDom(dom: VirtualNode[], heightIndex: Uint32Array, cells: Cell[], range: Range): void;
export declare function doRender(el: HTMLElement, nodeRender: ItemRenderFn, dom: VirtualNode[], updateCellHeight: (cell: Cell, node: HTMLElement) => void): void;
export declare function getViewport(scrollTop: number, vierportHeight: number, margin: number): Viewport;
export declare function getRange(heightIndex: Uint32Array, viewport: Viewport, buffer: number): Range;
export declare function getShouldUpdate(dirtyIndex: number, currentRange: Range, range: Range): boolean;
export declare function findCellIndex(cells: Cell[], index: number): number;
export declare function inplaceUpdate(dst: Cell[], src: Cell[], offset: number): Cell[];
export declare function calcCells(items: any[], itemHeight: ItemHeightFn | undefined, headerFn: HeaderFn | undefined, footerFn: HeaderFn | undefined, approxHeaderHeight: number, approxFooterHeight: number, approxItemHeight: number, j: number, offset: number, len: number): Cell[];
export declare function calcHeightIndex(buf: Uint32Array, cells: Cell[], index: number): number;
export declare function resizeBuffer(buf: Uint32Array | undefined, len: number): Uint32Array;
export declare function positionForIndex(index: number, cells: Cell[], heightIndex: Uint32Array): number;
