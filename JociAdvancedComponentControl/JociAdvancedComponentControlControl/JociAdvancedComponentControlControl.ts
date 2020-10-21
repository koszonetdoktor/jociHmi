/*
 * Generated 10/14/2020 3:03:08 PM
 * Copyright (C) 2020
 */

module TcHmi {
    export module Controls {
        export module JociAdvancedComponentControl {
            export class JociAdvancedComponentControlControl extends TcHmi
                .Controls.System.TcHmiControl {
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

                protected __angle: number

                public setAngle(angle: number | null) {
                    const angleValue = TcHmi.ValueConverter.toNumber(angle)
                    this.__angle = angleValue ?? 0
                    TcHmi.EventProvider.raise(
                        this.__id + ".onPropertyChanged",
                        { propertyName: "Angle" }
                    )
                    this.processNewAngleValue()
                }

                public getAngle() {
                    return this.__angle
                }

                public processNewAngleValue() {
                    document.dispatchEvent(
                        new CustomEvent(`${this.__id}_angleChange`, {
                            detail: { value: this.__angle },
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
                        ".TcHmi_Controls_JociAdvancedComponentControl_JociAdvancedComponentControlControl-Template"
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
                    console.log("Attacging")

                    const buttonContainer = this.__elementTemplateRoot.find(
                        ".button"
                    )[0]

                    console.log("ID", this.__id)
                    // @ts-ignore
                    new window.OldDoorComponent({
                        target: buttonContainer,
                        props: {
                            eventName: `${this.__id}_angleChange`,
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

        registerEx(
            "JociAdvancedComponentControlControl",
            "TcHmi.Controls.JociAdvancedComponentControl",
            JociAdvancedComponentControl.JociAdvancedComponentControlControl
        )
    }
}
