import { NgModule } from '@angular/core';
import { IonBottomSheetComponent } from './components/ion-bottom-sheet.component';
import { IonBottomSheetProvider } from './providers/ion-bottom-sheet-provider';
import * as i0 from "@angular/core";
var IonBottomSheetModule = /** @class */ (function () {
    function IonBottomSheetModule() {
    }
    IonBottomSheetModule.forRoot = function () {
        return {
            ngModule: IonBottomSheetModule,
            providers: [IonBottomSheetProvider]
        };
    };
    IonBottomSheetModule.ngModuleDef = i0.ɵɵdefineNgModule({ type: IonBottomSheetModule });
    IonBottomSheetModule.ngInjectorDef = i0.ɵɵdefineInjector({ factory: function IonBottomSheetModule_Factory(t) { return new (t || IonBottomSheetModule)(); } });
    return IonBottomSheetModule;
}());
export { IonBottomSheetModule };
/*@__PURE__*/ i0.ɵɵsetNgModuleScope(IonBottomSheetModule, { declarations: [IonBottomSheetComponent], exports: [IonBottomSheetComponent] });
/*@__PURE__*/ i0.ɵsetClassMetadata(IonBottomSheetModule, [{
        type: NgModule,
        args: [{
                declarations: [IonBottomSheetComponent],
                exports: [IonBottomSheetComponent]
            }]
    }], null, null);
//# sourceMappingURL=ion-bottom-sheet.module.js.map