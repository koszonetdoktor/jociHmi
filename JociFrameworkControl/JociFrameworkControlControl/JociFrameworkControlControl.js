/*
 * Generated 10/13/2020 2:45:38 PM
 * Copyright (C) 2020
 */
var TcHmi;
(function (TcHmi) {
    let Controls;
    (function (Controls) {
        let JociFrameworkControl;
        (function (JociFrameworkControl) {
            class JociFrameworkControlControl extends TcHmi.Controls.System.TcHmiControl {
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
                setPosition(position) {
                    this.__position = position;
                }
                getPosition() {
                    return this.__position;
                }
                /**
                  * If raised, the control object exists in control cache and constructor of each inheritation level was called.
                  * Call attribute processor functions here to initialize default values!
                  */
                __previnit() {
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
                __init() {
                    super.__init();
                }
                /**
                * @description Is called by tachcontrol() after the control instance gets part of the current DOM.
                * Is only allowed to be called from the framework itself!
                */
                __attach() {
                    super.__attach();
                    console.log("ATTACH");
                    console.log("DO i have read and watch ? ", TcHmi.Symbol.read);
                    const angleSymbol = new TcHmi.Symbol("%ctrl%TcHmi_Controls_Beckhoff_TcHmiTextbox::Text%/ctrl%");
                    console.log("Whats here? ", angleSymbol.watch);
                    /**
                     * Initialize everything which is only available while the control is part of the active dom.
                     */
                    this.__controlButton = this.__elementTemplateRoot.find("button");
                    console.log("this is called in the attaach, with button", this.__controlButton);
                    this.__controlButton.on("click", () => {
                        console.log("position", this.getPosition());
                        console.log("this button is clicked!");
                        const currentColor = this.__controlButton.css("background-color");
                        console.log("CurretnColor", currentColor);
                        if (currentColor !== "red") {
                            console.log("setTo Red");
                            this.__controlButton.css("background-color", "red");
                        }
                        else {
                            this.__controlButton.css("background-color", "gray");
                        }
                    });
                }
                /**
                * @description Is called by tachcontrol() after the control instance is no longer part of the current DOM.
                * Is only allowed to be called from the framework itself!
                */
                __detach() {
                    super.__detach();
                    this.__controlButton.remove("click");
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
            JociFrameworkControl.JociFrameworkControlControl = JociFrameworkControlControl;
        })(JociFrameworkControl = Controls.JociFrameworkControl || (Controls.JociFrameworkControl = {}));
        Controls.registerEx('JociFrameworkControlControl', 'TcHmi.Controls.JociFrameworkControl', JociFrameworkControl.JociFrameworkControlControl);
    })(Controls = TcHmi.Controls || (TcHmi.Controls = {}));
})(TcHmi || (TcHmi = {}));
//# sourceMappingURL=JociFrameworkControlControl.js.map