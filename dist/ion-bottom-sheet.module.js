var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { IonBottomSheetComponent } from './components/ion-bottom-sheet.component';
import { IonBottomSheetProvider } from './providers/ion-bottom-sheet-provider';
var IonBottomSheetModule = /** @class */ (function () {
    function IonBottomSheetModule() {
    }
    IonBottomSheetModule_1 = IonBottomSheetModule;
    IonBottomSheetModule.forRoot = function () {
        return {
            ngModule: IonBottomSheetModule_1,
            providers: [IonBottomSheetProvider]
        };
    };
    var IonBottomSheetModule_1;
    IonBottomSheetModule = IonBottomSheetModule_1 = __decorate([
        NgModule({
            declarations: [IonBottomSheetComponent],
            exports: [IonBottomSheetComponent]
        })
    ], IonBottomSheetModule);
    return IonBottomSheetModule;
}());
export { IonBottomSheetModule };
//# sourceMappingURL=ion-bottom-sheet.module.js.map