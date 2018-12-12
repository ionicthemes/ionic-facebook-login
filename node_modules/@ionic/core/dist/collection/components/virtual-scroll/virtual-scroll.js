import { calcCells, calcHeightIndex, doRender, findCellIndex, getRange, getShouldUpdate, getViewport, inplaceUpdate, positionForIndex, resizeBuffer, updateVDom } from './virtual-scroll-utils';
export class VirtualScroll {
    constructor() {
        this.range = { offset: 0, length: 0 };
        this.viewportHeight = 0;
        this.cells = [];
        this.virtualDom = [];
        this.isEnabled = false;
        this.viewportOffset = 0;
        this.currentScrollTop = 0;
        this.indexDirty = 0;
        this.lastItemLen = 0;
        this.totalHeight = 0;
        this.approxItemHeight = 45;
        this.approxHeaderHeight = 40;
        this.approxFooterHeight = 40;
    }
    itemsChanged() {
        this.calcCells();
        this.updateVirtualScroll();
    }
    async componentDidLoad() {
        const contentEl = this.el.closest('ion-content');
        if (!contentEl) {
            console.error('virtual-scroll must be used inside ion-content');
            return;
        }
        await contentEl.componentOnReady();
        this.contentEl = contentEl;
        this.scrollEl = await contentEl.getScrollElement();
        this.calcCells();
        this.updateState();
    }
    componentDidUpdate() {
        this.updateState();
    }
    componentDidUnload() {
        this.scrollEl = undefined;
    }
    onScroll() {
        this.updateVirtualScroll();
    }
    onResize() {
        this.updateVirtualScroll();
    }
    positionForItem(index) {
        return Promise.resolve(positionForIndex(index, this.cells, this.getHeightIndex()));
    }
    markDirty(offset, len = -1) {
        if (!this.items) {
            return;
        }
        const length = (len === -1)
            ? this.items.length - offset
            : len;
        const max = this.lastItemLen;
        let j = 0;
        if (offset > 0 && offset < max) {
            j = findCellIndex(this.cells, offset);
        }
        else if (offset === 0) {
            j = 0;
        }
        else if (offset === max) {
            j = this.cells.length;
        }
        else {
            console.warn('bad values for markDirty');
            return;
        }
        const cells = calcCells(this.items, this.itemHeight, this.headerFn, this.footerFn, this.approxHeaderHeight, this.approxFooterHeight, this.approxItemHeight, j, offset, length);
        console.debug('[virtual] cells recalculated', cells.length);
        this.cells = inplaceUpdate(this.cells, cells, offset);
        this.lastItemLen = this.items.length;
        this.indexDirty = Math.max(offset - 1, 0);
        this.scheduleUpdate();
    }
    markDirtyTail() {
        if (this.items) {
            const offset = this.lastItemLen;
            this.markDirty(offset, this.items.length - offset);
        }
    }
    updateVirtualScroll() {
        if (!this.isEnabled || !this.scrollEl) {
            return;
        }
        if (this.timerUpdate) {
            clearTimeout(this.timerUpdate);
            this.timerUpdate = undefined;
        }
        this.queue.read(this.readVS.bind(this));
        this.queue.write(this.writeVS.bind(this));
    }
    readVS() {
        const { contentEl, scrollEl, el } = this;
        let topOffset = 0;
        let node = el;
        while (node && node !== contentEl) {
            topOffset += node.offsetTop;
            node = node.parentElement;
        }
        this.viewportOffset = topOffset;
        if (scrollEl) {
            this.viewportHeight = scrollEl.offsetHeight;
            this.currentScrollTop = scrollEl.scrollTop;
        }
    }
    writeVS() {
        const dirtyIndex = this.indexDirty;
        const scrollTop = this.currentScrollTop - this.viewportOffset;
        const viewport = getViewport(scrollTop, this.viewportHeight, 100);
        const heightIndex = this.getHeightIndex();
        const range = getRange(heightIndex, viewport, 2);
        const shouldUpdate = getShouldUpdate(dirtyIndex, this.range, range);
        if (!shouldUpdate) {
            return;
        }
        this.range = range;
        updateVDom(this.virtualDom, heightIndex, this.cells, range);
        if (this.nodeRender) {
            doRender(this.el, this.nodeRender, this.virtualDom, this.updateCellHeight.bind(this));
        }
        else if (this.domRender) {
            this.domRender(this.virtualDom);
        }
        else if (this.renderItem) {
            this.el.forceUpdate();
        }
    }
    updateCellHeight(cell, node) {
        const update = () => {
            if (node['$ionCell'] === cell) {
                const style = this.win.getComputedStyle(node);
                const height = node.offsetHeight + parseFloat(style.getPropertyValue('margin-bottom'));
                this.setCellHeight(cell, height);
            }
        };
        if (node && node.componentOnReady) {
            node.componentOnReady().then(update);
        }
        else {
            update();
        }
    }
    setCellHeight(cell, height) {
        const index = cell.i;
        if (cell !== this.cells[index]) {
            return;
        }
        cell.visible = true;
        if (cell.height !== height) {
            console.debug(`[virtual] cell height changed ${cell.height}px -> ${height}px`);
            cell.height = height;
            this.indexDirty = Math.min(this.indexDirty, index);
            this.scheduleUpdate();
        }
    }
    scheduleUpdate() {
        clearTimeout(this.timerUpdate);
        this.timerUpdate = setTimeout(() => this.updateVirtualScroll(), 100);
    }
    updateState() {
        const shouldEnable = !!(this.scrollEl &&
            this.cells);
        if (shouldEnable !== this.isEnabled) {
            this.enableScrollEvents(shouldEnable);
            if (shouldEnable) {
                this.updateVirtualScroll();
            }
        }
    }
    calcCells() {
        if (!this.items) {
            return;
        }
        this.lastItemLen = this.items.length;
        this.cells = calcCells(this.items, this.itemHeight, this.headerFn, this.footerFn, this.approxHeaderHeight, this.approxFooterHeight, this.approxItemHeight, 0, 0, this.lastItemLen);
        console.debug('[virtual] cells recalculated', this.cells.length);
        this.indexDirty = 0;
    }
    getHeightIndex() {
        if (this.indexDirty !== Infinity) {
            this.calcHeightIndex(this.indexDirty);
        }
        return this.heightIndex;
    }
    calcHeightIndex(index = 0) {
        this.heightIndex = resizeBuffer(this.heightIndex, this.cells.length);
        this.totalHeight = calcHeightIndex(this.heightIndex, this.cells, index);
        console.debug('[virtual] height index recalculated', this.heightIndex.length - index);
        this.indexDirty = Infinity;
    }
    enableScrollEvents(shouldListen) {
        if (this.scrollEl) {
            this.isEnabled = shouldListen;
            this.enableListener(this, 'scroll', shouldListen, this.scrollEl);
        }
    }
    renderVirtualNode(node) {
        const { type, value, index } = node.cell;
        switch (type) {
            case 0: return this.renderItem(value, index);
            case 1: return this.renderHeader(value, index);
            case 2: return this.renderFooter(value, index);
        }
    }
    hostData() {
        return {
            style: {
                height: `${this.totalHeight}px`
            }
        };
    }
    render() {
        if (this.renderItem) {
            return (h(VirtualProxy, { dom: this.virtualDom }, this.virtualDom.map(node => this.renderVirtualNode(node))));
        }
        return undefined;
    }
    static get is() { return "ion-virtual-scroll"; }
    static get properties() { return {
        "approxFooterHeight": {
            "type": Number,
            "attr": "approx-footer-height"
        },
        "approxHeaderHeight": {
            "type": Number,
            "attr": "approx-header-height"
        },
        "approxItemHeight": {
            "type": Number,
            "attr": "approx-item-height"
        },
        "domRender": {
            "type": "Any",
            "attr": "dom-render"
        },
        "el": {
            "elementRef": true
        },
        "enableListener": {
            "context": "enableListener"
        },
        "footerFn": {
            "type": "Any",
            "attr": "footer-fn"
        },
        "headerFn": {
            "type": "Any",
            "attr": "header-fn"
        },
        "itemHeight": {
            "type": "Any",
            "attr": "item-height",
            "watchCallbacks": ["itemsChanged"]
        },
        "items": {
            "type": "Any",
            "attr": "items",
            "watchCallbacks": ["itemsChanged"]
        },
        "markDirty": {
            "method": true
        },
        "markDirtyTail": {
            "method": true
        },
        "nodeRender": {
            "type": "Any",
            "attr": "node-render"
        },
        "positionForItem": {
            "method": true
        },
        "queue": {
            "context": "queue"
        },
        "renderFooter": {
            "type": "Any",
            "attr": "render-footer"
        },
        "renderHeader": {
            "type": "Any",
            "attr": "render-header"
        },
        "renderItem": {
            "type": "Any",
            "attr": "render-item"
        },
        "totalHeight": {
            "state": true
        },
        "win": {
            "context": "window"
        }
    }; }
    static get listeners() { return [{
            "name": "scroll",
            "method": "onScroll",
            "disabled": true
        }, {
            "name": "window:resize",
            "method": "onResize",
            "passive": true
        }]; }
    static get style() { return "/**style-placeholder:ion-virtual-scroll:**/"; }
}
const VirtualProxy = ({ dom }, children, utils) => {
    return utils.map(children, (child, i) => {
        const node = dom[i];
        const vattrs = child.vattrs || {};
        let classes = vattrs.class || '';
        classes += 'virtual-item ';
        if (!node.visible) {
            classes += 'virtual-loading';
        }
        return Object.assign({}, child, { vattrs: Object.assign({}, vattrs, { class: classes, style: Object.assign({}, vattrs.style, { transform: `translate3d(0,${node.top}px,0)` }) }) });
    });
};
