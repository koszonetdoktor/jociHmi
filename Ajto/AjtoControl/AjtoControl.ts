/*
 * Generated 10/19/2020 1:32:47 PM
 * Copyright (C) 2020
 */
module TcHmi {
    export module Controls {
        export module Ajto {
            export class AjtoControl extends TcHmi.Controls.System
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
                constructor(
                    element: JQuery,
                    pcElement: JQuery,
                    attrs: TcHmi.Controls.ControlAttributeList
                ) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs)
                }

                protected __elementTemplateRoot!: JQuery

                protected __openAngle: number
                protected __endAngle: number
                protected __endPosition: boolean
                protected __startPosition: boolean
                protected __targetPosition: string
                protected __currentPosition: string

                public setSzog(angle: number | null) {
                    const angleValue = TcHmi.ValueConverter.toNumber(angle)
                    this.__openAngle = angleValue ?? 0
                    TcHmi.EventProvider.raise(
                        this.__id + ".onPropertyChanged",
                        { propertyName: "Szog" }
                    )
                    this.fireChangeEvent("open_angle", this.__openAngle)
                }

                public getSzog() {
                    return this.__openAngle
                }

                public setNyitasiSzog(angle: number | null) {
                    const angleValue = TcHmi.ValueConverter.toNumber(angle)
                    this.__endAngle = angleValue ?? 0
                    TcHmi.EventProvider.raise(
                        this.__id + ".onPropertyChanged",
                        { propertyName: "NyitasiSzog" }
                    )
                    this.fireChangeEvent("end_angle", this.__endAngle)
                }

                public getNyitasiSzog() {
                    return this.__endAngle
                }

                public setNyitottVegallas(isInPosition: boolean | null) {
                    console.log("positon", isInPosition)
                    this.__endPosition =
                        TcHmi.ValueConverter.toBoolean(isInPosition) ?? false
                    TcHmi.EventProvider.raise(
                        this.__id + ".onPropertyChanged",
                        { propertyName: "NyitottVegallas" }
                    )
                    this.fireChangeEvent("end_position", this.__endPosition)
                }

                public getNyitottVegallas() {
                    return this.__endPosition
                }

                public setZartVegallas(isInPosition: boolean | null) {
                    this.__startPosition =
                        TcHmi.ValueConverter.toBoolean(isInPosition) ?? false
                    TcHmi.EventProvider.raise(
                        this.__id + ".onPropertyChanged",
                        { propertyName: "ZartVegallas" }
                    )
                    this.fireChangeEvent("start_position", this.__startPosition)
                }

                public getZartVegallas() {
                    return this.__startPosition
                }

                public setCelpozicio(position: number | null) {
                    const positionValue = TcHmi.ValueConverter.toNumber(
                        position
                    )?.toFixed(2)
                    this.__targetPosition = positionValue ?? "0"
                    TcHmi.EventProvider.raise(
                        this.__id + ".onPropertyChanged",
                        { propertyName: "Celpozicio" }
                    )
                    this.fireChangeEvent(
                        "target_position",
                        this.__targetPosition
                    )
                }

                public getCelpozicio() {
                    return Number(this.__targetPosition)
                }

                public setAktualisPozicio(position: number | null) {
                    const positionValue = TcHmi.ValueConverter.toNumber(
                        position
                    )?.toFixed(2)
                    this.__currentPosition = positionValue ?? "0"
                    TcHmi.EventProvider.raise(
                        this.__id + ".onPropertyChanged",
                        { propertyName: "AktualisPozicio" }
                    )
                    this.fireChangeEvent(
                        "current_position",
                        this.__currentPosition
                    )
                }

                public getAktualisPozicio() {
                    return Number(this.__currentPosition)
                }

                public fireChangeEvent(
                    key: string,
                    value: number | boolean | string
                ) {
                    document.dispatchEvent(
                        new CustomEvent(`${this.__id}_change`, {
                            detail: {
                                key,
                                value,
                            },
                        })
                    )
                }

                /**
                 * If raised, the control object exists in control cache and constructor of each inheritation level was called.
                 * Call attribute processor functions here to initialize default values!
                 */
                public __previnit() {
                    // Fetch template root element
                    this.__elementTemplateRoot = this.__element.find(
                        ".TcHmi_Controls_Ajto_AjtoControl-Template"
                    )
                    if (this.__elementTemplateRoot.length === 0) {
                        throw new Error("Invalid Template.html")
                    }
                    // Call __previnit of base class
                    super.__previnit()
                }
                /**
                 * @description Is called during control initialize phase after attribute setter have been called based on it's default or initial html dom values.
                 * @returns {void}
                 */
                public __init() {
                    super.__init()
                }

                /**
                 * @description Is called by tachcontrol() after the control instance gets part of the current DOM.
                 * Is only allowed to be called from the framework itself!
                 */
                public __attach() {
                    super.__attach()

                    const elementContainer = this.__elementTemplateRoot.find(
                        ".root"
                    )[0]

                    //@ts-ignore
                    new window.DoorComponent({
                        target: elementContainer,
                        props: {
                            valueChangeEvent: `${this.__id}_change`,
                        },
                    })

                    /**
                     * Initialize everything which is only available while the control is part of the active dom.
                     */
                }

                /**
                 * @description Is called by tachcontrol() after the control instance is no longer part of the current DOM.
                 * Is only allowed to be called from the framework itself!
                 */
                public __detach() {
                    super.__detach()

                    /**
                     * Disable everything which is not needed while the control is not part of the active dom.
                     * No need to listen to events for example!
                     */
                }

                /**
                 * @description Destroy the current control instance.
                 * Will be called automatically if system destroys control!
                 */
                public destroy() {
                    /**
                     * While __keepAlive is set to true control must not be destroyed.
                     */
                    if (this.__keepAlive) {
                        return
                    }

                    super.destroy()

                    /**
                     * Free resources like child controls etc.
                     */
                }
            }
        }

        registerEx("AjtoControl", "TcHmi.Controls.Ajto", Ajto.AjtoControl)
    }
}
