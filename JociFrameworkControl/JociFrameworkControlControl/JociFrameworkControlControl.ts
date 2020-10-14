/*
 * Generated 10/13/2020 2:45:38 PM
 * Copyright (C) 2020
 */
module TcHmi {
    export module Controls {
        export module JociFrameworkControl {
            export class JociFrameworkControlControl extends TcHmi.Controls.System.TcHmiControl {

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
                constructor(element: JQuery, pcElement: JQuery, attrs: TcHmi.Controls.ControlAttributeList) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                }

                protected __elementTemplateRoot!: JQuery;

                protected __circle: JQuery<HTMLElement>
                protected __pointer: JQuery<HTMLElement>


                protected __position: string

                
                public setPosition(position: string | null) {
                    const positionValue = TcHmi.ValueConverter.toString(position)
                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'Position' });
                    this.__position = positionValue ?? ""
                    this.processNewPostiion()
                }

                public getPosition() {
                    return this.__position
                }

                private __makeBackgroundStyle(deg: string) {
                    return `conic-gradient(from 0turn at 0% 100%, lime ${deg}deg, black 0deg)`
                }

                private __makePositionStyle(deg: string) {
                    return `rotate(${deg}deg)`
                }


                public processNewPostiion() {
                    console.log("POSTION from this", this.__position)
                    console.log("position from function", this.getPosition())

                    

                    this.__circle.css("background", this.__makeBackgroundStyle(this.__position))
                    this.__pointer.css("transform", this.__makePositionStyle(this.__position))
                }

				/**
                  * If raised, the control object exists in control cache and constructor of each inheritation level was called.
                  * Call attribute processor functions here to initialize default values!
                  */
                public __previnit() {
                    // Fetch template root element
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_JociFrameworkControl_JociFrameworkControlControl-Template');
                    if (this.__elementTemplateRoot.length === 0) {
                        throw new Error('Invalid Template.html');
                    }
                    // Call __previnit of base class
                    super.__previnit();
                }
                /** 
                 * @description Is called during control initialize phase after attribute setter have been called based on it's default or initial html dom values. 
                 * @returns {void}
                 */
                public __init() {
                    super.__init();

                    // Here the attribute setters have been called arleady

                }

                /**
                * @description Is called by tachcontrol() after the control instance gets part of the current DOM.
                * Is only allowed to be called from the framework itself!
                */
                public __attach() {
                    super.__attach();
                    /**
                     * Initialize everything which is only available while the control is part of the active dom.
                     */
                    this.__circle = this.__elementTemplateRoot.find(".cirlce")
                    this.__pointer = this.__elementTemplateRoot.find(".pointer")

                }

                /**
                * @description Is called by tachcontrol() after the control instance is no longer part of the current DOM.
                * Is only allowed to be called from the framework itself!
                */
                public __detach() {
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
                public destroy() {
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
        }

        registerEx('JociFrameworkControlControl', 'TcHmi.Controls.JociFrameworkControl', JociFrameworkControl.JociFrameworkControlControl);
    }
}