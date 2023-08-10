import { ElementRef, Renderer2, EventEmitter, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { Platform, DomController } from '@ionic/angular';
import { SheetState } from './ion-bottom-sheet-state';
export declare class IonBottomSheetComponent implements AfterViewInit, OnChanges {
    private _element;
    private _renderer;
    private _domCtrl;
    private _platform;
    dockedHeight: number;
    minHeight: number;
    topDistance: number;
    bounceDelta: number;
    canBounce: Boolean;
    roundBorder: Boolean;
    roundBorderOnTop: Boolean;
    shadowBorder: Boolean;
    shadowBorderOnTop: Boolean;
    disableDrag: Boolean;
    hideCloseButton: Boolean;
    hideCloseButtonOnTop: Boolean;
    hideDragIcon: Boolean;
    hideDragIconOnTop: Boolean;
    hideTitle: Boolean;
    hideHeader: Boolean;
    hideSeparator: Boolean;
    titleCentered: Boolean;
    titleSize: string;
    titleFamily: string;
    transition: string;
    state: SheetState;
    title: string;
    enableScrollContent: Boolean;
    enableScrollContentOnlyOnTop: Boolean;
    enableShadowHeaderOnScrolling: Boolean;
    useSmoothScrolling: Boolean;
    stateChange: EventEmitter<SheetState>;
    private _startPosition;
    private _startScroll;
    private _sheetTopAnimationHasBeenPerformed;
    private _bottomShadowHeaderHasBeenPerformed;
    private _scrollUpContentCheckHasBeenPerformed;
    private _defaultScrollSetting;
    private _scrollContent;
    private _dyInitialScrollDown;
    private _dyInitialScrollUp;
    constructor(_element: ElementRef, _renderer: Renderer2, _domCtrl: DomController, _platform: Platform);
    /*********************************************************************************************************/
    /*********************************************************************************************************/
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    /*********************************************************************************************************/
    /*********************************************************************************************************/
    private _loadHeaderGesture;
    private _loadContentGesture;
    private _loadForScroll;
    private _adjustForShadow;
    private _loadEvents;
    private _loadCssStyle;
    private _setSheetState;
    private _getPosition;
    private _nextSate;
    private _checkForScrolling;
    private _checkForAnimationOnTop;
    private _cssSwitchClass;
    private _cssAutoManageClass;
    private _cssAddClass;
    private _cssRemoveClass;
    private _setStyle;
    private _enableTransition;
    private _disableTransition;
    private _restoreNativeContentSize;
    private _changeNativeContentSize;
    private _getHeaderHeight;
    private _autoEnableContentScroll;
    private _contentShadowOnScroll;
    private _setTranslateY;
    closeSheet(): void;
    /*********************************************************************************************************/
    /*********************************************************************************************************/
    private _onHeaderGestureStart;
    private _onHeaderGestureEnd;
    private _onHeaderGestureMove;
    private _onContentGestureStart;
    private _onContentGestureEnd;
    private _onContentGestureMove;
}
