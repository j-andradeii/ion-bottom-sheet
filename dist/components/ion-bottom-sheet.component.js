var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { Platform, DomController } from '@ionic/angular';
import { SheetState } from './ion-bottom-sheet-state';
import * as Hammer from 'hammerjs';
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
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], IonBottomSheetComponent.prototype, "dockedHeight", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], IonBottomSheetComponent.prototype, "minHeight", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], IonBottomSheetComponent.prototype, "topDistance", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], IonBottomSheetComponent.prototype, "bounceDelta", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], IonBottomSheetComponent.prototype, "canBounce", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], IonBottomSheetComponent.prototype, "roundBorder", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], IonBottomSheetComponent.prototype, "roundBorderOnTop", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], IonBottomSheetComponent.prototype, "shadowBorder", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], IonBottomSheetComponent.prototype, "shadowBorderOnTop", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], IonBottomSheetComponent.prototype, "disableDrag", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], IonBottomSheetComponent.prototype, "hideCloseButton", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], IonBottomSheetComponent.prototype, "hideCloseButtonOnTop", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], IonBottomSheetComponent.prototype, "hideDragIcon", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], IonBottomSheetComponent.prototype, "hideDragIconOnTop", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], IonBottomSheetComponent.prototype, "hideTitle", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], IonBottomSheetComponent.prototype, "hideHeader", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], IonBottomSheetComponent.prototype, "hideSeparator", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], IonBottomSheetComponent.prototype, "titleCentered", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], IonBottomSheetComponent.prototype, "titleSize", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], IonBottomSheetComponent.prototype, "titleFamily", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], IonBottomSheetComponent.prototype, "transition", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], IonBottomSheetComponent.prototype, "state", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], IonBottomSheetComponent.prototype, "title", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], IonBottomSheetComponent.prototype, "enableScrollContent", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], IonBottomSheetComponent.prototype, "enableScrollContentOnlyOnTop", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], IonBottomSheetComponent.prototype, "enableShadowHeaderOnScrolling", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], IonBottomSheetComponent.prototype, "useSmoothScrolling", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], IonBottomSheetComponent.prototype, "stateChange", void 0);
    IonBottomSheetComponent = __decorate([
        Component({
            selector: 'ion-bottom-sheet',
            template: "<div id=\"ibs-container\">\n  <div id=\"ibs-header\" #ibs_header>\n    <div id=\"drag-icon\"></div>\n    <div id=\"title-button\">\n      <div id=\"title\">{{ title }}</div>\n      <div id=\"close-button\"></div>\n    </div>\n  </div>\n  <div id=\"ibs-content\" #ibs_content>\n    <div id=\"ibs-content-inner\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</div>\n",
            styles: [":host  {\n  touch-action: none;\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  z-index: 999 !important;\n  background-color: transparent;\n  will-change: transform;\n}\n\n:host #ibs-container{\n  position: relative;\n  background-color: white;\n  width: 100%;\n  height: 100%;\n}\n\n:host #ibs-container.round-border{\n  border-top-left-radius: 15px;\n  border-top-right-radius: 15px;\n}\n\n:host #ibs-container.shadow-border{\n  box-shadow: 0px -2px 10px  rgba(0, 0, 0, 0.12);\n}\n\n:host #ibs-header.bottom-header-shadow{\n  box-shadow: 0 3px 3px -3px  rgba(0, 0, 0, 0.12);\n}\n\n:host #ibs-header{\n  padding: 5px;\n  width: 100%;\n  min-height: 35px;\n}\n\n:host .separator{\n  border-bottom-style: solid;\n  border-bottom-color: rgba(220, 220, 220, 1);\n  border-bottom-width: 1px;\n}\n\n:host #drag-icon{\n  margin: 0 auto;\n  height: 5px;\n  width: 36px;\n  background-color: #c0c0c0;\n  border-radius: 4px;\n}\n\n:host #title-button{\n  width: 100%;\n  height: 100%;\n  position: relative;\n  height: 26px;\n  margin-top: 5px;\n  margin-bottom: 5px;\n}\n\n:host #close-button{\n  width: 26px;\n  height: 26px;\n  position: absolute;\n  right: 10px;\n  background: #c0c0c0;\n  border-radius: 100%;\n  content: url('data:image/svg+xml; utf8, <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"> <path fill=\"7a7a7e\" d=\"M278.6 256l68.2-68.2c6.2-6.2 6.2-16.4 0-22.6-6.2-6.2-16.4-6.2-22.6 0L256 233.4l-68.2-68.2c-6.2-6.2-16.4-6.2-22.6 0-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3l68.2 68.2-68.2 68.2c-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3 6.2 6.2 16.4 6.2 22.6 0l68.2-68.2 68.2 68.2c6.2 6.2 16.4 6.2 22.6 0 6.2-6.2 6.2-16.4 0-22.6L278.6 256z\"/> </svg>');\n}\n\n:host #title{\n  position: absolute;\n  left: 10px;\n  padding: 0px;\n  margin: 0px;\n  font-size: 20px;\n  line-height: 26px;\n  color: inherit; \n}\n\n:host .txt-center{\n  text-align: center;\n  width: 100%;\n  left: 0px !important;\n}\n\n:host #ibs-content{\n  width: 100%;\n  height: 100%;\n  padding-left: 5px;\n  padding-right: 5px;\n}\n\n:host .pd5{\n  padding-top: 5px;\n}\n\n:host #ibs-content-inner{\n  touch-action: none;\n  overflow: hidden;\n  height: 100%;\n}\n\n:host .fadeOut {\n  visibility: hidden;\n  opacity: 0;\n  transition: visibility 0s linear 700ms, opacity 700ms;  \n}\n\n:host .fadeIn {\n  visibility: visible;\n  opacity: 1;\n  transition: visibility 0s linear 0s, opacity 300ms;\n}\n\n:host.no-drag-icon #drag-icon,\n:host.no-close-btn #close-button,\n:host.no-title #title,\n:host.no-header #ibs-header {\n  display: none !important;\n}\n\n:host.no-title #title-button {\n  margin-top: 0px;\n}\n\n:host.no-title.no-drag-icon #title-button {\n  margin-top: 5px;\n}\n\n:host.no-title.no-close-btn #title-button {\n  margin-bottom: 0px;\n}\n\n:host.no-drag-icon.no-title.no-close-btn #title-button {\n  margin-top: 0px;\n  margin-bottom: 0px;\n}\n"]
        }),
        __metadata("design:paramtypes", [ElementRef,
            Renderer2,
            DomController,
            Platform])
    ], IonBottomSheetComponent);
    return IonBottomSheetComponent;
}());
export { IonBottomSheetComponent };
//# sourceMappingURL=ion-bottom-sheet.component.js.map