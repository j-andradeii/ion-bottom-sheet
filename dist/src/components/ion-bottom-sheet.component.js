import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SheetState } from './ion-bottom-sheet-state';
import * as Hammer from 'hammerjs';
import * as i0 from "@angular/core";
import * as i1 from "@ionic/angular";
var _c0 = ["id", "ibs-container"];
var _c1 = ["id", "ibs-header"];
var _c2 = ["ibs_header", ""];
var _c3 = ["id", "drag-icon"];
var _c4 = ["id", "title-button"];
var _c5 = ["id", "title"];
var _c6 = ["id", "close-button"];
var _c7 = ["id", "ibs-content"];
var _c8 = ["ibs_content", ""];
var _c9 = ["id", "ibs-content-inner"];
var _c10 = ["*"];
var IonBottomSheetComponent = /** @class */ (function () {
    function IonBottomSheetComponent(_element, _renderer, _domCtrl, _platform) {
        this._element = _element;
        this._renderer = _renderer;
        this._domCtrl = _domCtrl;
        this._platform = _platform;
        this.dockedHeight = 200;
        this.minHeight = 0;
        this.topDistance = 0;
        this.bounceDelta = 30;
        this.canBounce = true;
        this.roundBorder = true;
        this.roundBorderOnTop = false;
        this.shadowBorder = true;
        this.shadowBorderOnTop = false;
        this.disableDrag = false;
        this.hideCloseButton = false;
        this.hideCloseButtonOnTop = false;
        this.hideDragIcon = false;
        this.hideDragIconOnTop = false;
        this.hideTitle = false;
        this.hideHeader = false;
        this.hideSeparator = false;
        this.titleCentered = false;
        this.titleSize = "20px";
        this.titleFamily = "inherit";
        this.transition = '0.25s ease-out';
        this.state = SheetState.Bottom;
        this.title = "Header Title";
        this.enableScrollContent = false;
        this.enableScrollContentOnlyOnTop = false;
        this.enableShadowHeaderOnScrolling = true;
        this.useSmoothScrolling = true;
        this.stateChange = new EventEmitter();
        this._startScroll = 0;
        this._sheetTopAnimationHasBeenPerformed = false;
        this._bottomShadowHeaderHasBeenPerformed = false;
        this._scrollUpContentCheckHasBeenPerformed = false;
        this._defaultScrollSetting = false;
        this._scrollContent = false;
        this._dyInitialScrollDown = 0;
        this._dyInitialScrollUp = 0;
        this._adjustForShadow();
    }
    /*********************************************************************************************************/
    /* Ng interface implements */
    /*********************************************************************************************************/
    IonBottomSheetComponent.prototype.ngAfterViewInit = function () {
        this._loadForScroll();
        this._loadEvents();
        this._loadCssStyle();
        this._loadContentGesture();
        this._loadHeaderGesture();
    };
    IonBottomSheetComponent.prototype.ngOnChanges = function (changes) {
        if (!changes.state) {
            return;
        }
        this._restoreNativeContentSize();
        this._enableTransition();
        this._setSheetState(changes.state.currentValue);
    };
    /*********************************************************************************************************/
    /* Base class methods                                                                                    */
    /*********************************************************************************************************/
    IonBottomSheetComponent.prototype._loadHeaderGesture = function () {
        var _this = this;
        if (this.disableDrag) {
            return;
        }
        var target = this.enableScrollContent ? this._element.nativeElement.querySelector("#ibs-header") : this._element.nativeElement;
        var headerGesture = new Hammer(target);
        headerGesture.get('pan').set({ enable: true, direction: Hammer.DIRECTION_VERTICAL });
        headerGesture.on('panstart', function () { return _this._onHeaderGestureStart(); });
        headerGesture.on('panend', function (ev) { return _this._onHeaderGestureEnd(ev); });
        headerGesture.on('pan', function (ev) { return _this._onHeaderGestureMove(ev); });
    };
    IonBottomSheetComponent.prototype._loadContentGesture = function () {
        var _this = this;
        if (!this.enableScrollContent) {
            return;
        }
        var contentGesture = new Hammer(this._element.nativeElement.querySelector("#ibs-content-inner"));
        contentGesture.get('pan').set({ enable: true, direction: Hammer.DIRECTION_VERTICAL });
        contentGesture.on('panstart', function () { return _this._onContentGestureStart(); });
        contentGesture.on('panend', function (ev) { return _this._onContentGestureEnd(ev); });
        contentGesture.on('pan', function (ev) { return _this._onContentGestureMove(ev); });
    };
    IonBottomSheetComponent.prototype._loadForScroll = function () {
        this._defaultScrollSetting = this.enableScrollContent && (!this.enableScrollContentOnlyOnTop || !this.canBounce || this.disableDrag);
        this._scrollContent = this._defaultScrollSetting;
    };
    IonBottomSheetComponent.prototype._adjustForShadow = function () {
        if (!this.shadowBorder) {
            return;
        }
        if (this.minHeight > 0) {
            return;
        }
        this.minHeight = this.minHeight - 10;
    };
    IonBottomSheetComponent.prototype._loadEvents = function () {
        this._renderer.listen(this._element.nativeElement, "transitionend", this._checkForAnimationOnTop.bind(this));
        if (!this.hideCloseButton) {
            this._renderer.listen(this._element.nativeElement.querySelector("#close-button"), "click", this.closeSheet.bind(this));
        }
        if (this.enableScrollContent) {
            this._renderer.listen(this._element.nativeElement, "transitionend", this._checkForScrolling.bind(this));
            this._renderer.listen(this._element.nativeElement.querySelector("#ibs-content-inner"), "scroll", this._contentShadowOnScroll.bind(this));
            this._renderer.listen(this._element.nativeElement, "transitionend", this._changeNativeContentSize.bind(this));
        }
    };
    IonBottomSheetComponent.prototype._loadCssStyle = function () {
        this._cssAutoManageClass("no-close-btn", this.hideCloseButton, this._element.nativeElement);
        this._cssAutoManageClass("no-drag-icon", this.hideDragIcon, this._element.nativeElement);
        this._cssAutoManageClass("no-title", this.hideTitle, this._element.nativeElement);
        this._cssAutoManageClass("no-header", this.hideHeader, this._element.nativeElement);
        this._cssAutoManageClass("separator", !this.hideSeparator, this._element.nativeElement.querySelector("#ibs-header"));
        this._cssAutoManageClass("round-border", this.roundBorder, this._element.nativeElement.querySelector("#ibs-container"));
        this._cssAutoManageClass("shadow-border", this.shadowBorder, this._element.nativeElement.querySelector("#ibs-container"));
        this._cssAutoManageClass("txt-center", this.titleCentered, this._element.nativeElement.querySelector("#title"));
        this._cssAutoManageClass("pd5", this.enableShadowHeaderOnScrolling, this._element.nativeElement.querySelector("#ibs-content"));
        this._setStyle("font-size", this.titleSize, this._element.nativeElement.querySelector("#title"));
        this._setStyle("font-family", this.titleFamily, this._element.nativeElement.querySelector("#title"));
    };
    IonBottomSheetComponent.prototype._setSheetState = function (state) {
        switch (state) {
            case SheetState.Bottom:
                this._setTranslateY('calc(100vh - ' + this.minHeight + 'px)');
                break;
            case SheetState.Docked:
                this._setTranslateY('calc(100vh - ' + this.dockedHeight + 'px)');
                break;
            case SheetState.Top:
                this._setTranslateY(this.topDistance + 'px');
                break;
        }
    };
    IonBottomSheetComponent.prototype._getPosition = function (currentState) {
        switch (currentState) {
            case SheetState.Bottom:
                return this._platform.height() - this.minHeight;
            case SheetState.Docked:
                return this._platform.height() - this.dockedHeight;
            case SheetState.Top:
                return this.topDistance;
        }
    };
    IonBottomSheetComponent.prototype._nextSate = function (currentState, gestureDirection) {
        switch (currentState) {
            case SheetState.Bottom:
                return gestureDirection < 0 ? SheetState.Docked : SheetState.Bottom;
            case SheetState.Docked:
                return gestureDirection < 0 ? SheetState.Top : SheetState.Bottom;
            case SheetState.Top:
                return gestureDirection < 0 ? SheetState.Top : SheetState.Docked;
        }
    };
    IonBottomSheetComponent.prototype._checkForScrolling = function () {
        this._dyInitialScrollUp = this._dyInitialScrollDown = 0;
        if (this._element.nativeElement.getBoundingClientRect().y == this._getPosition(SheetState.Top)) {
            this._scrollContent = this.enableScrollContent;
            return;
        }
        this._scrollContent = this._defaultScrollSetting;
    };
    IonBottomSheetComponent.prototype._checkForAnimationOnTop = function () {
        if (this._element.nativeElement.getBoundingClientRect().y == this._getPosition(SheetState.Top)) {
            if (this._sheetTopAnimationHasBeenPerformed) {
                return;
            }
            this._sheetTopAnimationHasBeenPerformed = true;
            this._scrollContent = this.enableScrollContent;
        }
        else {
            if (!this._sheetTopAnimationHasBeenPerformed) {
                return;
            }
            this._sheetTopAnimationHasBeenPerformed = false;
            this._scrollContent = false;
            if (this.enableScrollContent && this.enableScrollContentOnlyOnTop) {
                this._element.nativeElement.querySelector("#ibs-content-inner").scroll({ top: 0, behavior: this.useSmoothScrolling ? 'smooth' : 'auto' });
            }
        }
        if (!this.roundBorderOnTop && this.roundBorder) {
            this._cssAutoManageClass("round-border", !this._sheetTopAnimationHasBeenPerformed, this._element.nativeElement.querySelector("#ibs-container"));
        }
        if (!this.shadowBorderOnTop && this.shadowBorder) {
            this._cssAutoManageClass("shadow-border", !this._sheetTopAnimationHasBeenPerformed, this._element.nativeElement.querySelector("#ibs-container"));
        }
        if (this.hideDragIconOnTop && !this.hideDragIcon) {
            this._cssSwitchClass(this._sheetTopAnimationHasBeenPerformed ? "fadeOut" : "fadeIn", this._sheetTopAnimationHasBeenPerformed ? "fadeIn" : "fadeOut", this._element.nativeElement.querySelector("#drag-icon"));
        }
        if (this.hideCloseButtonOnTop && !this.hideCloseButton) {
            this._cssSwitchClass(this._sheetTopAnimationHasBeenPerformed ? "fadeOut" : "fadeIn", this._sheetTopAnimationHasBeenPerformed ? "fadeIn" : "fadeOut", this._element.nativeElement.querySelector("#close-button"));
        }
    };
    IonBottomSheetComponent.prototype._cssSwitchClass = function (entryClassName, exitClassName, selector) {
        this._cssRemoveClass(exitClassName, selector);
        this._cssAddClass(entryClassName, selector);
    };
    IonBottomSheetComponent.prototype._cssAutoManageClass = function (className, isToaddClass, selector) {
        var _this = this;
        this._domCtrl.write(function () { isToaddClass ? _this._cssAddClass(className, selector) : _this._cssRemoveClass(className, selector); });
    };
    IonBottomSheetComponent.prototype._cssAddClass = function (className, selector) {
        var _this = this;
        this._domCtrl.write(function () { return _this._renderer.addClass(selector, className); });
    };
    IonBottomSheetComponent.prototype._cssRemoveClass = function (className, selector) {
        var _this = this;
        this._domCtrl.write(function () { return _this._renderer.removeClass(selector, className); });
    };
    IonBottomSheetComponent.prototype._setStyle = function (property, value, selector) {
        var _this = this;
        this._domCtrl.write(function () { return _this._renderer.setStyle(selector, property, value); });
    };
    IonBottomSheetComponent.prototype._enableTransition = function () {
        this._setStyle('transition', this.transition, this._element.nativeElement);
    };
    IonBottomSheetComponent.prototype._disableTransition = function () {
        this._setStyle('transition', "none", this._element.nativeElement);
    };
    IonBottomSheetComponent.prototype._restoreNativeContentSize = function () {
        if (!this._scrollContent) {
            return;
        }
        var newContentHeight = "calc(100vh - " + (this.topDistance + this._getHeaderHeight()) + "px)";
        this._setStyle("height", newContentHeight, this._element.nativeElement.querySelector("#ibs-content"));
    };
    IonBottomSheetComponent.prototype._changeNativeContentSize = function () {
        if (!this._scrollContent) {
            return;
        }
        var newContentHeight = "calc(100vh - " + (this._element.nativeElement.getBoundingClientRect().y + this._getHeaderHeight()) + "px)";
        this._setStyle("height", newContentHeight, this._element.nativeElement.querySelector("#ibs-content"));
        this._autoEnableContentScroll();
    };
    IonBottomSheetComponent.prototype._getHeaderHeight = function () {
        return this.hideHeader ? 0 : this._element.nativeElement.querySelector("#ibs-header").getBoundingClientRect().height;
    };
    IonBottomSheetComponent.prototype._autoEnableContentScroll = function () {
        var _this = this;
        this._domCtrl.read(function () {
            var contentInnerScrollHeight = _this._element.nativeElement.querySelector("#ibs-content-inner").scrollHeight;
            var contentHeight = _this._element.nativeElement.querySelector("#ibs-content").getBoundingClientRect().height;
            _this._scrollContent = (contentHeight - contentInnerScrollHeight < 0);
        });
    };
    IonBottomSheetComponent.prototype._contentShadowOnScroll = function () {
        if (this._element.nativeElement.querySelector("#ibs-content-inner").scrollTop > 0) {
            if (this._bottomShadowHeaderHasBeenPerformed) {
                return;
            }
            this._bottomShadowHeaderHasBeenPerformed = true;
        }
        else {
            if (!this._bottomShadowHeaderHasBeenPerformed) {
                return;
            }
            this._bottomShadowHeaderHasBeenPerformed = false;
        }
        if (this.enableShadowHeaderOnScrolling) {
            this._cssAutoManageClass("bottom-header-shadow", this._bottomShadowHeaderHasBeenPerformed, this._element.nativeElement.querySelector("#ibs-header"));
        }
    };
    IonBottomSheetComponent.prototype._setTranslateY = function (value) {
        this._setStyle('transform', 'translateY(' + value + ')', this._element.nativeElement);
    };
    IonBottomSheetComponent.prototype.closeSheet = function () {
        this.stateChange.emit(this.state = SheetState.Bottom);
    };
    /*********************************************************************************************************/
    /* Gestures                                                                                              */
    /*********************************************************************************************************/
    IonBottomSheetComponent.prototype._onHeaderGestureStart = function () {
        this._startPosition = this._element.nativeElement.getBoundingClientRect().y;
        this._disableTransition();
        this._restoreNativeContentSize();
    };
    IonBottomSheetComponent.prototype._onHeaderGestureEnd = function (ev, dyInitial) {
        if (dyInitial === void 0) { dyInitial = 0; }
        if (!this.canBounce) {
            return;
        }
        if (Math.abs(ev.deltaY - dyInitial) > this.bounceDelta) {
            this.stateChange.emit(this.state = this._nextSate(this.state, ev.deltaY - dyInitial));
        }
        else {
            this._enableTransition();
            this._setTranslateY(this._getPosition(this.state) + "px");
        }
    };
    IonBottomSheetComponent.prototype._onHeaderGestureMove = function (ev, dyInitial) {
        if (dyInitial === void 0) { dyInitial = 0; }
        var nextYposition = this._startPosition + ev.deltaY - dyInitial;
        if ((nextYposition <= this._getPosition(SheetState.Top)) && ((ev.deltaY - dyInitial) < 0)) {
            nextYposition = this._getPosition(SheetState.Top);
        }
        if ((nextYposition >= this._getPosition(SheetState.Bottom)) && ((ev.deltaY - dyInitial) > 0)) {
            nextYposition = this._getPosition(SheetState.Bottom);
        }
        this._setTranslateY(nextYposition + "px");
        this._changeNativeContentSize();
        this._checkForAnimationOnTop();
    };
    IonBottomSheetComponent.prototype._onContentGestureStart = function () {
        if (!this._scrollContent && !this.disableDrag) {
            this._onHeaderGestureStart();
            return;
        }
        this._startScroll = this._element.nativeElement.querySelector("#ibs-content-inner").scrollTop;
    };
    IonBottomSheetComponent.prototype._onContentGestureEnd = function (ev) {
        if (!this._scrollContent && !this.disableDrag) {
            this._onHeaderGestureEnd(ev, this._dyInitialScrollDown);
            this._scrollContent = true;
            return;
        }
        // initialize up and down scroll initial values
        this._dyInitialScrollUp = this._dyInitialScrollDown = 0;
        // restore performance scroll flag 
        this._scrollUpContentCheckHasBeenPerformed = false;
        // define scroll math function
        var currentScrollPosition = this._element.nativeElement.querySelector("#ibs-content-inner").scrollTop;
        var speed = -Math.sign(ev.deltaY) * (Math.exp(Math.round(Math.abs(ev.velocityY))) - 1);
        var mP = this.useSmoothScrolling ? speed * Math.abs(ev.deltaY) : 0;
        var nextScroll = currentScrollPosition + mP;
        // scroll
        this._element.nativeElement.querySelector("#ibs-content-inner").scroll({ top: nextScroll, behavior: this.useSmoothScrolling ? 'smooth' : 'auto' });
    };
    IonBottomSheetComponent.prototype._onContentGestureMove = function (ev) {
        if (!this._scrollContent && !this.disableDrag) {
            this._onHeaderGestureMove(ev, this._dyInitialScrollDown);
            return;
        }
        // get Delta Y before scrolling
        if ((this.state != SheetState.Top) && (ev.deltaY < 0) && (!this._scrollUpContentCheckHasBeenPerformed)) {
            this._dyInitialScrollUp = ev.deltaY;
            this._scrollUpContentCheckHasBeenPerformed = true;
        }
        var nextScroll = this._startScroll - ev.deltaY + this._dyInitialScrollUp;
        // stop scroll and move all sheet down / up
        if ((nextScroll <= 0) && (ev.deltaY - this._dyInitialScrollUp > 0)) {
            this._onHeaderGestureStart();
            this._scrollContent = false;
            nextScroll = 0;
            this._dyInitialScrollUp = 0;
            // get Delta Y before moving sheet
            this._dyInitialScrollDown = ev.deltaY;
            this._scrollUpContentCheckHasBeenPerformed = false;
        }
        this._element.nativeElement.querySelector("#ibs-content-inner").scroll(0, nextScroll);
    };
    IonBottomSheetComponent.ngComponentDef = i0.ɵɵdefineComponent({ type: IonBottomSheetComponent, selectors: [["ion-bottom-sheet"]], factory: function IonBottomSheetComponent_Factory(t) { return new (t || IonBottomSheetComponent)(i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i1.DomController), i0.ɵɵdirectiveInject(i1.Platform)); }, inputs: { dockedHeight: "dockedHeight", minHeight: "minHeight", topDistance: "topDistance", bounceDelta: "bounceDelta", canBounce: "canBounce", roundBorder: "roundBorder", roundBorderOnTop: "roundBorderOnTop", shadowBorder: "shadowBorder", shadowBorderOnTop: "shadowBorderOnTop", disableDrag: "disableDrag", hideCloseButton: "hideCloseButton", hideCloseButtonOnTop: "hideCloseButtonOnTop", hideDragIcon: "hideDragIcon", hideDragIconOnTop: "hideDragIconOnTop", hideTitle: "hideTitle", hideHeader: "hideHeader", hideSeparator: "hideSeparator", titleCentered: "titleCentered", titleSize: "titleSize", titleFamily: "titleFamily", transition: "transition", state: "state", title: "title", enableScrollContent: "enableScrollContent", enableScrollContentOnlyOnTop: "enableScrollContentOnlyOnTop", enableShadowHeaderOnScrolling: "enableShadowHeaderOnScrolling", useSmoothScrolling: "useSmoothScrolling" }, outputs: { stateChange: "stateChange" }, features: [i0.ɵɵNgOnChangesFeature()], ngContentSelectors: _c10, consts: 12, vars: 1, template: function IonBottomSheetComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵelementStart(0, "div", _c0);
            i0.ɵɵelementStart(1, "div", _c1, _c2);
            i0.ɵɵelement(3, "div", _c3);
            i0.ɵɵelementStart(4, "div", _c4);
            i0.ɵɵelementStart(5, "div", _c5);
            i0.ɵɵtext(6);
            i0.ɵɵelementEnd();
            i0.ɵɵelement(7, "div", _c6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "div", _c7, _c8);
            i0.ɵɵelementStart(10, "div", _c9);
            i0.ɵɵprojection(11);
            i0.ɵɵelementEnd();
            i0.ɵɵelementEnd();
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵselect(6);
            i0.ɵɵtextInterpolate(ctx.title);
        } }, styles: ["[_nghost-%COMP%]  {\n  touch-action: none;\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  z-index: 999 !important;\n  background-color: transparent;\n  will-change: transform;\n}\n\n[_nghost-%COMP%]   #ibs-container[_ngcontent-%COMP%]{\n  position: relative;\n  background-color: white;\n  width: 100%;\n  height: 100%;\n}\n\n[_nghost-%COMP%]   #ibs-container.round-border[_ngcontent-%COMP%]{\n  border-top-left-radius: 15px;\n  border-top-right-radius: 15px;\n}\n\n[_nghost-%COMP%]   #ibs-container.shadow-border[_ngcontent-%COMP%]{\n  box-shadow: 0px -2px 10px  rgba(0, 0, 0, 0.12);\n}\n\n[_nghost-%COMP%]   #ibs-header.bottom-header-shadow[_ngcontent-%COMP%]{\n  box-shadow: 0 3px 3px -3px  rgba(0, 0, 0, 0.12);\n}\n\n[_nghost-%COMP%]   #ibs-header[_ngcontent-%COMP%]{\n  padding: 5px;\n  width: 100%;\n  min-height: 35px;\n}\n\n[_nghost-%COMP%]   .separator[_ngcontent-%COMP%]{\n  border-bottom-style: solid;\n  border-bottom-color: rgba(220, 220, 220, 1);\n  border-bottom-width: 1px;\n}\n\n[_nghost-%COMP%]   #drag-icon[_ngcontent-%COMP%]{\n  margin: 0 auto;\n  height: 5px;\n  width: 36px;\n  background-color: #c0c0c0;\n  border-radius: 4px;\n}\n\n[_nghost-%COMP%]   #title-button[_ngcontent-%COMP%]{\n  width: 100%;\n  height: 100%;\n  position: relative;\n  height: 26px;\n  margin-top: 5px;\n  margin-bottom: 5px;\n}\n\n[_nghost-%COMP%]   #close-button[_ngcontent-%COMP%]{\n  width: 26px;\n  height: 26px;\n  position: absolute;\n  right: 10px;\n  background: #c0c0c0;\n  border-radius: 100%;\n  content: url('data:image/svg+xml; utf8, <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"> <path fill=\"7a7a7e\" d=\"M278.6 256l68.2-68.2c6.2-6.2 6.2-16.4 0-22.6-6.2-6.2-16.4-6.2-22.6 0L256 233.4l-68.2-68.2c-6.2-6.2-16.4-6.2-22.6 0-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3l68.2 68.2-68.2 68.2c-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3 6.2 6.2 16.4 6.2 22.6 0l68.2-68.2 68.2 68.2c6.2 6.2 16.4 6.2 22.6 0 6.2-6.2 6.2-16.4 0-22.6L278.6 256z\"/> </svg>');\n}\n\n[_nghost-%COMP%]   #title[_ngcontent-%COMP%]{\n  position: absolute;\n  left: 10px;\n  padding: 0px;\n  margin: 0px;\n  font-size: 20px;\n  line-height: 26px;\n  color: inherit; \n}\n\n[_nghost-%COMP%]   .txt-center[_ngcontent-%COMP%]{\n  text-align: center;\n  width: 100%;\n  left: 0px !important;\n}\n\n[_nghost-%COMP%]   #ibs-content[_ngcontent-%COMP%]{\n  width: 100%;\n  height: 100%;\n  padding-left: 5px;\n  padding-right: 5px;\n}\n\n[_nghost-%COMP%]   .pd5[_ngcontent-%COMP%]{\n  padding-top: 5px;\n}\n\n[_nghost-%COMP%]   #ibs-content-inner[_ngcontent-%COMP%]{\n  touch-action: none;\n  overflow: hidden;\n  height: 100%;\n}\n\n[_nghost-%COMP%]   .fadeOut[_ngcontent-%COMP%] {\n  visibility: hidden;\n  opacity: 0;\n  transition: visibility 0s linear 700ms, opacity 700ms;  \n}\n\n[_nghost-%COMP%]   .fadeIn[_ngcontent-%COMP%] {\n  visibility: visible;\n  opacity: 1;\n  transition: visibility 0s linear 0s, opacity 300ms;\n}\n\n.no-drag-icon[_nghost-%COMP%]   #drag-icon[_ngcontent-%COMP%], .no-close-btn[_nghost-%COMP%]   #close-button[_ngcontent-%COMP%], .no-title[_nghost-%COMP%]   #title[_ngcontent-%COMP%], .no-header[_nghost-%COMP%]   #ibs-header[_ngcontent-%COMP%] {\n  display: none !important;\n}\n\n.no-title[_nghost-%COMP%]   #title-button[_ngcontent-%COMP%] {\n  margin-top: 0px;\n}\n\n.no-title.no-drag-icon[_nghost-%COMP%]   #title-button[_ngcontent-%COMP%] {\n  margin-top: 5px;\n}\n\n.no-title.no-close-btn[_nghost-%COMP%]   #title-button[_ngcontent-%COMP%] {\n  margin-bottom: 0px;\n}\n\n.no-drag-icon.no-title.no-close-btn[_nghost-%COMP%]   #title-button[_ngcontent-%COMP%] {\n  margin-top: 0px;\n  margin-bottom: 0px;\n}"] });
    return IonBottomSheetComponent;
}());
export { IonBottomSheetComponent };
/*@__PURE__*/ i0.ɵsetClassMetadata(IonBottomSheetComponent, [{
        type: Component,
        args: [{
                selector: 'ion-bottom-sheet',
                templateUrl: './ion-bottom-sheet.component.html',
                styleUrls: ['./ion-bottom-sheet.component.scss']
            }]
    }], function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i1.DomController }, { type: i1.Platform }]; }, { dockedHeight: [{
            type: Input
        }], minHeight: [{
            type: Input
        }], topDistance: [{
            type: Input
        }], bounceDelta: [{
            type: Input
        }], canBounce: [{
            type: Input
        }], roundBorder: [{
            type: Input
        }], roundBorderOnTop: [{
            type: Input
        }], shadowBorder: [{
            type: Input
        }], shadowBorderOnTop: [{
            type: Input
        }], disableDrag: [{
            type: Input
        }], hideCloseButton: [{
            type: Input
        }], hideCloseButtonOnTop: [{
            type: Input
        }], hideDragIcon: [{
            type: Input
        }], hideDragIconOnTop: [{
            type: Input
        }], hideTitle: [{
            type: Input
        }], hideHeader: [{
            type: Input
        }], hideSeparator: [{
            type: Input
        }], titleCentered: [{
            type: Input
        }], titleSize: [{
            type: Input
        }], titleFamily: [{
            type: Input
        }], transition: [{
            type: Input
        }], state: [{
            type: Input
        }], title: [{
            type: Input
        }], enableScrollContent: [{
            type: Input
        }], enableScrollContentOnlyOnTop: [{
            type: Input
        }], enableShadowHeaderOnScrolling: [{
            type: Input
        }], useSmoothScrolling: [{
            type: Input
        }], stateChange: [{
            type: Output
        }] });
//# sourceMappingURL=ion-bottom-sheet.component.js.map