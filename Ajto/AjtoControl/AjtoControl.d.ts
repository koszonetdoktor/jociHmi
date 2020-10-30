declare module TcHmi {
    module Controls {
        module Ajto {
            class AjtoControl extends TcHmi.Controls.System
                .TcHmiControl {
                /**
                 * @description Constructor of the control
                 * @param {JQuery} element Element from HTML (internal, do not use)
                 * @param {JQuery} pcElement precompiled Element (internal, do not use)
                 * @param {TcHmi.Controls.ControlAttributeList} attrs Attributes defined in HTML in a special format (internal, do not use)
                 * @returns {void}
                 */
                constructor(element: JQuery, pcElement: JQuery, attrs: TcHmi.Controls.ControlAttributeList);
                protected __elementTemplateRoot: JQuery;
                protected __openAngle: number;
                protected __endAngle: number;
                protected __endPosition: boolean;
                protected __startPosition: boolean;
                protected __targetPosition: string;
                protected __currentPosition: string;
                setDutAcoVisu(newValue: any): void;
                getDutAcoVisu(): void;
                setSzog(angle: number | null): void;
                getSzog(): number;
                setNyitasiSzog(angle: number | null): void;
                getNyitasiSzog(): number;
                setNyitottVegallas(isInPosition: boolean | null): void;
                getNyitottVegallas(): boolean;
                setZartVegallas(isInPosition: boolean | null): void;
                getZartVegallas(): boolean;
                setCelpozicio(position: number | null): void;
                getCelpozicio(): number;
                setAktualisPozicio(position: number | null): void;
                getAktualisPozicio(): number;
                fireChangeEvent(key: string, value: number | boolean | string): void;
                /**
                 * If raised, the control object exists in control cache and constructor of each inheritation level was called.
                 * Call attribute processor functions here to initialize default values!
                 */
                __previnit(): void;
                /**
                 * @description Is called during control initialize phase after attribute setter have been called based on it's default or initial html dom values.
                 * @returns {void}
                 */
                __init(): void;
                /**
                 * @description Is called by tachcontrol() after the control instance gets part of the current DOM.
                 * Is only allowed to be called from the framework itself!
                 */
                __attach(): void;
                /**
                 * @description Is called by tachcontrol() after the control instance is no longer part of the current DOM.
                 * Is only allowed to be called from the framework itself!
                 */
                __detach(): void;
                /**
                 * @description Destroy the current control instance.
                 * Will be called automatically if system destroys control!
                 */
                destroy(): void;
            }
        }
    }
}
