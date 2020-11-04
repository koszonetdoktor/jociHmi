/*
 * Generated 10/19/2020 1:32:47 PM
 * Copyright (C) 2020
 */
var TcHmi;
(function (TcHmi) {
    let Controls;
    (function (Controls) {
        let Ajto;
        (function (Ajto) {
            class AjtoControl extends TcHmi.Controls.System
                .TcHmiControl {
                /*
                Attribute philosophy
                --------------------
                - Local variables are not set while definition in class, so they have the value 'undefined'.
                - On compile the Framework sets the value from HTML or from theme (possibly 'null') via normal setters
                - The "changed detection" in the setter will result in processing the value only once while compile
                - Attention: If we have a Server Binding on an Attribute the setter can be very late or never (leaving the value = undefined).
                */
                /**
                 * @description Constructor of the control
                 * @param {JQuery} element Element from HTML (internal, do not use)
                 * @param {JQuery} pcElement precompiled Element (internal, do not use)
                 * @param {TcHmi.Controls.ControlAttributeList} attrs Attributes defined in HTML in a special format (internal, do not use)
                 * @returns {void}
                 */
                constructor(element, pcElement, attrs) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                }
                setDutAcoVisu(newValue) {
                    const convertedValue = TcHmi.ValueConverter.toObject(newValue);
                    this.__dutAcoVisu = convertedValue;
                    console.log("DUT", this.__dutAcoVisu);
                    TcHmi.EventProvider.raise(this.__id + ".onPropertyChanged", { propertyName: "DutAcoVisu" });
                    this.fireChangeEvents();
                }
                getDutAcoVisu() {
                    return this.__dutAcoVisu;
                }
                fireChangeEvents() {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                    const eventValues = {
                        open_angle: (_b = (_a = this.__dutAcoVisu) === null || _a === void 0 ? void 0 : _a.rActPos.toFixed(2)) !== null && _b !== void 0 ? _b : "0",
                        end_angle: (_d = (_c = this.__dutAcoVisu) === null || _c === void 0 ? void 0 : _c.rNextDestPos.toFixed(2)) !== null && _d !== void 0 ? _d : "0",
                        end_position: (_f = (_e = this.__dutAcoVisu) === null || _e === void 0 ? void 0 : _e.bEndPosUp) !== null && _f !== void 0 ? _f : false,
                        start_position: (_h = (_g = this.__dutAcoVisu) === null || _g === void 0 ? void 0 : _g.bEndPosDown) !== null && _h !== void 0 ? _h : false,
                        target_position: (_k = (_j = this.__dutAcoVisu) === null || _j === void 0 ? void 0 : _j.rNextDestPos.toFixed(2)) !== null && _k !== void 0 ? _k : "0",
                        current_position: (_m = (_l = this.__dutAcoVisu) === null || _l === void 0 ? void 0 : _l.rActPos.toFixed(2)) !== null && _m !== void 0 ? _m : "0",
                    };
                    Object.keys(eventValues).forEach((event) => {
                        document.dispatchEvent(new CustomEvent(`${this.__id}_change`, {
                            detail: {
                                key: event,
                                value: eventValues[event],
                            },
                        }));
                    });
                }
                setSzog(angle) {
                    const angleValue = TcHmi.ValueConverter.toNumber(angle);
                    this.__openAngle = angleValue !== null && angleValue !== void 0 ? angleValue : 0;
                    // TcHmi.EventProvider.raise(
                    //     this.__id + ".onPropertyChanged",
                    //     { propertyName: "Szog" }
                    // )
                    // this.fireChangeEvent("open_angle", this.__openAngle)
                }
                getSzog() {
                    return this.__openAngle;
                }
                setNyitasiSzog(angle) {
                    const angleValue = TcHmi.ValueConverter.toNumber(angle);
                    this.__endAngle = angleValue !== null && angleValue !== void 0 ? angleValue : 0;
                    // TcHmi.EventProvider.raise(
                    //     this.__id + ".onPropertyChanged",
                    //     { propertyName: "NyitasiSzog" }
                    // )
                    // this.fireChangeEvent("end_angle", this.__endAngle)
                }
                getNyitasiSzog() {
                    return this.__endAngle;
                }
                setNyitottVegallas(isInPosition) {
                    var _a;
                    console.log("positon", isInPosition);
                    this.__endPosition = (_a = TcHmi.ValueConverter.toBoolean(isInPosition)) !== null && _a !== void 0 ? _a : false;
                    // TcHmi.EventProvider.raise(
                    //     this.__id + ".onPropertyChanged",
                    //     { propertyName: "NyitottVegallas" }
                    // )
                    // this.fireChangeEvent("end_position", this.__endPosition)
                }
                getNyitottVegallas() {
                    return this.__endPosition;
                }
                setZartVegallas(isInPosition) {
                    var _a;
                    this.__startPosition = (_a = TcHmi.ValueConverter.toBoolean(isInPosition)) !== null && _a !== void 0 ? _a : false;
                    // TcHmi.EventProvider.raise(
                    //     this.__id + ".onPropertyChanged",
                    //     { propertyName: "ZartVegallas" }
                    // )
                    // this.fireChangeEvent("start_position", this.__startPosition)
                }
                getZartVegallas() {
                    return this.__startPosition;
                }
                setCelpozicio(position) {
                    var _a;
                    const positionValue = (_a = TcHmi.ValueConverter.toNumber(position)) === null || _a === void 0 ? void 0 : _a.toFixed(2);
                    this.__targetPosition = positionValue !== null && positionValue !== void 0 ? positionValue : "0";
                    // TcHmi.EventProvider.raise(
                    //     this.__id + ".onPropertyChanged",
                    //     { propertyName: "Celpozicio" }
                    // )
                    // this.fireChangeEvent(
                    //     "target_position",
                    //     this.__targetPosition
                    // )
                }
                getCelpozicio() {
                    return Number(this.__targetPosition);
                }
                setAktualisPozicio(position) {
                    var _a;
                    const positionValue = (_a = TcHmi.ValueConverter.toNumber(position)) === null || _a === void 0 ? void 0 : _a.toFixed(2);
                    this.__currentPosition = positionValue !== null && positionValue !== void 0 ? positionValue : "0";
                    // TcHmi.EventProvider.raise(
                    //     this.__id + ".onPropertyChanged",
                    //     { propertyName: "AktualisPozicio" }
                    // )
                    // this.fireChangeEvent(
                    //     "current_position",
                    //     this.__currentPosition
                    // )
                }
                getAktualisPozicio() {
                    return Number(this.__currentPosition);
                }
                fireChangeEvent(key, value) {
                    document.dispatchEvent(new CustomEvent(`${this.__id}_change`, {
                        detail: {
                            key,
                            value,
                        },
                    }));
                }
                /**
                 * If raised, the control object exists in control cache and constructor of each inheritation level was called.
                 * Call attribute processor functions here to initialize default values!
                 */
                __previnit() {
                    // Fetch template root element
                    this.__elementTemplateRoot = this.__element.find(".TcHmi_Controls_Ajto_AjtoControl-Template");
                    if (this.__elementTemplateRoot.length === 0) {
                        throw new Error("Invalid Template.html");
                    }
                    // Call __previnit of base class
                    super.__previnit();
                }
                /**
                 * @description Is called during control initialize phase after attribute setter have been called based on it's default or initial html dom values.
                 * @returns {void}
                 */
                __init() {
                    super.__init();
                }
                /**
                 * @description Is called by tachcontrol() after the control instance gets part of the current DOM.
                 * Is only allowed to be called from the framework itself!
                 */
                __attach() {
                    super.__attach();
                    const elementContainer = this.__elementTemplateRoot.find(".root")[0];
                    //@ts-ignore
                    new window.DoorComponent({
                        target: elementContainer,
                        props: {
                            valueChangeEvent: `${this.__id}_change`,
                        },
                    });
                    /**
                     * Initialize everything which is only available while the control is part of the active dom.
                     */
                }
                /**
                 * @description Is called by tachcontrol() after the control instance is no longer part of the current DOM.
                 * Is only allowed to be called from the framework itself!
                 */
                __detach() {
                    super.__detach();
                    /**
                     * Disable everything which is not needed while the control is not part of the active dom.
                     * No need to listen to events for example!
                     */
                }
                /**
                 * @description Destroy the current control instance.
                 * Will be called automatically if system destroys control!
                 */
                destroy() {
                    /**
                     * While __keepAlive is set to true control must not be destroyed.
                     */
                    if (this.__keepAlive) {
                        return;
                    }
                    super.destroy();
                    /**
                     * Free resources like child controls etc.
                     */
                }
            }
            Ajto.AjtoControl = AjtoControl;
        })(Ajto = Controls.Ajto || (Controls.Ajto = {}));
        Controls.registerEx("AjtoControl", "TcHmi.Controls.Ajto", Ajto.AjtoControl);
    })(Controls = TcHmi.Controls || (TcHmi.Controls = {}));
})(TcHmi || (TcHmi = {}));
//# sourceMappingURL=AjtoControl.js.map