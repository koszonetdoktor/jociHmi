var TcHmi;!function(t){let e;!function(e){let o;!function(e){class o extends t.Controls.System.TcHmiControl{constructor(e,o,s){super(e,o,s),this.__icon={},this.__mousedown=!1,this.__touches=[],this.__state=!1,this.__stateLock=!1,this.__touchLock=!1,this.__destroyEventOnPropertyIsEnabledChanged=null,this.__onResolverForTextPaddingWatchCallback=e=>{!1===this.__isAttached&&this.__suspendObjectResolver("textPadding"),e.error===t.Errors.NONE?tchmi_equal(e.value,this.__textPadding)||(this.__textPadding=e.value,t.EventProvider.raise(this.__id+".onPropertyChanged",{propertyName:"TextPadding"}),this.__processTextPadding()):TCHMI_CONSOLE_LOG_LEVEL>=1&&t.Log.error("[Source=Control, Module=TcHmi.Controls.Beckhoff.TcHmiButton, Id="+this.getId()+", Attribute=TextPadding] Resolving symbols from object failed with error: "+t.Log.buildMessage(e.details))},this.__onResolverForIconPaddingWatchCallback=e=>{!1===this.__isAttached&&this.__suspendObjectResolver("iconPadding"),e.error===t.Errors.NONE?tchmi_equal(e.value,this.__icon.imagePadding)||(this.__icon.imagePadding=e.value,t.EventProvider.raise(this.__id+".onPropertyChanged",{propertyName:"IconPadding"}),this.__processIconPadding()):TCHMI_CONSOLE_LOG_LEVEL>=1&&t.Log.error("[Source=Control, Module=TcHmi.Controls.Beckhoff.TcHmiButton, Id="+this.getId()+", Attribute=IconPadding] Resolving symbols from object failed with error: "+t.Log.buildMessage(e.details))},this.__onResolverForTextColorWatchCallback=e=>{!1===this.__isAttached&&this.__suspendObjectResolver("textColor"),e.error===t.Errors.NONE?tchmi_equal(e.value,this.__textColor)||(this.__textColor=e.value,t.EventProvider.raise(this.__id+".onPropertyChanged",{propertyName:"TextColor"}),this.__processTextColor()):TCHMI_CONSOLE_LOG_LEVEL>=1&&t.Log.error("[Source=Control, Module=TcHmi.Controls.Beckhoff.TcHmiButton, Id="+this.getId()+", Attribute=TextColor] Resolving symbols from object failed with error: "+t.Log.buildMessage(e.details))},this.__destroyStateSymbolWatch=null,this.__mousedownHandler=this.__onMouseDown(),this.__mouseupHandler=this.__onMouseUp(),this.__mouseenterHandler=this.__onMouseEnter(),this.__mouseleaveHandler=this.__onMouseLeave(),this.__touchstartHandler=this.__onTouchStart(),this.__touchEndOrCancelHandler=this.__onTouchEndOrCancel()}__previnit(){if(this.__elementTemplateRoot=this.__element.find(".TcHmi_Controls_Beckhoff_TcHmiButton-template"),0===this.__elementTemplateRoot.length&&(this.__elementTemplateRoot=this.__element.find(".tchmi-button-template")),this.__elementContentTextSpan=this.__elementTemplateRoot.find(".TcHmi_Controls_Beckhoff_TcHmiButton-template-content-text"),0===this.__elementContentTextSpan.length&&(this.__elementContentTextSpan=this.__elementTemplateRoot.find(".tchmi-button-template-content-text")),0===this.__elementTemplateRoot.length||0===this.__elementContentTextSpan.length)throw new Error("Invalid Template.html");super.__previnit()}__init(){super.__init(),this.__processIcon();const t={passive:!0,capture:!1},e={passive:!1,capture:!1};this.__element[0].addEventListener("mousedown",this.__mousedownHandler,!!TCHMI_EVENT_OPTION_OBJECT_SUPPORTED&&t),this.__element[0].addEventListener("mouseenter",this.__mouseenterHandler,!!TCHMI_EVENT_OPTION_OBJECT_SUPPORTED&&t),this.__element[0].addEventListener("mouseleave",this.__mouseleaveHandler,!!TCHMI_EVENT_OPTION_OBJECT_SUPPORTED&&t),this.__element[0].addEventListener("touchstart",this.__touchstartHandler,!!TCHMI_EVENT_OPTION_OBJECT_SUPPORTED&&e),this.__element[0].addEventListener("touchend",this.__touchEndOrCancelHandler,!!TCHMI_EVENT_OPTION_OBJECT_SUPPORTED&&e),this.__element[0].addEventListener("touchcancel",this.__touchEndOrCancelHandler,!!TCHMI_EVENT_OPTION_OBJECT_SUPPORTED&&e)}__attach(){super.__attach();document.addEventListener("mouseup",this.__mouseupHandler,!!TCHMI_EVENT_OPTION_OBJECT_SUPPORTED&&{passive:!0,capture:!1}),this.__destroyEventOnPropertyIsEnabledChanged=t.EventProvider.register(this.getId()+".onPropertyChanged<IsEnabled>",this.__onPropertyIsEnabledChanged()),this.__stateSymbol&&!this.__destroyStateSymbolWatch&&(this.__destroyStateSymbolWatch=this.__stateSymbol.watch(this.__onStateSymbolWatch()))}__detach(){super.__detach();document.removeEventListener("mouseup",this.__mouseupHandler,!!TCHMI_EVENT_OPTION_OBJECT_SUPPORTED&&{passive:!0,capture:!1}),this.__destroyEventOnPropertyIsEnabledChanged&&(this.__destroyEventOnPropertyIsEnabledChanged(),this.__destroyEventOnPropertyIsEnabledChanged=null),this.__destroyStateSymbolWatch&&(this.__destroyStateSymbolWatch(),this.__destroyStateSymbolWatch=null)}destroy(){if(this.__keepAlive)return;const t={passive:!0,capture:!1},e={passive:!1,capture:!1};this.__element[0].removeEventListener("mousedown",this.__mousedownHandler,!!TCHMI_EVENT_OPTION_OBJECT_SUPPORTED&&t),this.__element[0].removeEventListener("mouseenter",this.__mouseenterHandler,!!TCHMI_EVENT_OPTION_OBJECT_SUPPORTED&&t),this.__element[0].removeEventListener("mouseleave",this.__mouseleaveHandler,!!TCHMI_EVENT_OPTION_OBJECT_SUPPORTED&&t),this.__element[0].removeEventListener("touchstart",this.__touchstartHandler,!!TCHMI_EVENT_OPTION_OBJECT_SUPPORTED&&t),this.__element[0].removeEventListener("touchend",this.__touchEndOrCancelHandler,!!TCHMI_EVENT_OPTION_OBJECT_SUPPORTED&&e),this.__element[0].removeEventListener("touchcancel",this.__touchEndOrCancelHandler,!!TCHMI_EVENT_OPTION_OBJECT_SUPPORTED&&e),super.destroy(),this.__destroyEventOnPropertyIsEnabledChanged&&(this.__destroyEventOnPropertyIsEnabledChanged(),this.__destroyEventOnPropertyIsEnabledChanged=null)}__processState(e,o,s){this.__state!==e&&(this.__state=e,this.__element[0].classList.toggle("down",this.__state),t.EventProvider.raise(this.getId()+(this.__state?".onStatePressed":".onStateReleased"),{control:this}),t.EventProvider.raise(this.getId()+".onStateChanged",{control:this,state:this.__state,stateOld:!this.__state}),this.__stateSymbol&&o&&this.__stateSymbol.write(this.__state,e=>{e.error!==t.Errors.NONE&&e.details&&TCHMI_CONSOLE_LOG_LEVEL>=1&&t.Log.error("[Source=Control, Module="+this.__type+", Id="+this.getId()+", Property=StateSymbol, "+(this.__stateSymbol?"Symbol = "+this.__stateSymbol.getExpression().toString():"")+"] "+t.Log.buildMessage(e.details))}))}__onPropertyIsEnabledChanged(){return(t,e)=>{this.getIsEnabled()?!this.__destroyStateSymbolWatch&&this.__stateSymbol&&(this.__destroyStateSymbolWatch=this.__stateSymbol.watch(this.__onStateSymbolWatch())):(this.__destroyStateSymbolWatch&&(this.__destroyStateSymbolWatch(),this.__destroyStateSymbolWatch=null),!0===this.__stateLock&&!0===this.__state?this.__processState(!1,!0,"attribute"):!1===this.__stateLock&&!0===this.__state&&this.__processState(!1,!1,"attribute"),this.__mousedown=!1,this.__stateLock=!1,this.__touches=[])}}__onMouseDown(){return e=>{this.__touchLock||0===e.button&&this.getIsEnabled()&&t.Access.checkAccess(this,"operate")&&(this.__mousedown=!0,!1===this.__stateLock&&(this.__stateLock=!0,this.__destroyStateSymbolWatch&&(this.__destroyStateSymbolWatch(),this.__destroyStateSymbolWatch=null),!1===this.__state&&this.__processState(!0,!0,"userInteraction")))}}__onMouseUp(){return e=>{this.__touchLock||0===e.button&&this.__mousedown&&this.getIsEnabled()&&t.Access.checkAccess(this,"operate")&&(this.__mousedown=!1,!0===this.__stateLock&&(!0===this.__state&&this.__processState(!1,!0,"userInteraction"),this.__stateLock=!1,!this.__destroyStateSymbolWatch&&this.__stateSymbol&&(this.__destroyStateSymbolWatch=this.__stateSymbol.watch(this.__onStateSymbolWatch()))))}}__onMouseEnter(){return e=>{this.__mousedown&&this.getIsEnabled()&&t.Access.checkAccess(this,"operate")&&!1===this.__stateLock&&(this.__stateLock=!0,this.__destroyStateSymbolWatch&&(this.__destroyStateSymbolWatch(),this.__destroyStateSymbolWatch=null),!1===this.__state&&this.__processState(!0,!0,"userInteraction"))}}__onMouseLeave(){return e=>{this.__mousedown&&this.getIsEnabled()&&t.Access.checkAccess(this,"operate")&&!0===this.__stateLock&&(!0===this.__state&&this.__processState(!1,!0,"userInteraction"),this.__stateLock=!1,!this.__destroyStateSymbolWatch&&this.__stateSymbol&&(this.__destroyStateSymbolWatch=this.__stateSymbol.watch(this.__onStateSymbolWatch())))}}__onTouchStart(){return e=>{if(!this.getIsEnabled())return;if(!t.Access.checkAccess(this,"operate"))return;this.__stateSymbol&&e.cancelable&&e.preventDefault();let o=Array.prototype.slice.apply(e.changedTouches).filter(t=>t.target===e.target);if(0===o.length)return;this.__touches=this.__touches.concat(o),!1===this.__stateLock&&(this.__stateLock=!0,this.__destroyStateSymbolWatch&&(this.__destroyStateSymbolWatch(),this.__destroyStateSymbolWatch=null),!1===this.__state&&this.__processState(!0,!0,"userInteraction")),this.__touchLock=!0;let s=this;setTimeout((function(){s.__touchLock=!1}),300)}}__onTouchEndOrCancel(){return e=>{if(0===this.__touches.length)return;if(!this.getIsEnabled())return;if(!t.Access.checkAccess(this,"operate"))return;this.__stateSymbol&&e.cancelable&&e.preventDefault();let o=Array.prototype.slice.apply(e.changedTouches).map(t=>t.identifier);this.__touches=this.__touches.filter(t=>-1===o.indexOf(t.identifier)),this.__touches.length>0||!0===this.__stateLock&&(!0===this.__state&&this.__processState(!1,!0,"userInteraction"),this.__stateLock=!1,!this.__destroyStateSymbolWatch&&this.__stateSymbol&&(this.__destroyStateSymbolWatch=this.__stateSymbol.watch(this.__onStateSymbolWatch())))}}setText(valueNew){let e=t.ValueConverter.toString(valueNew);null===e&&(e=this.getAttributeDefaultValueInternal("Text")),e!==this.__text&&(this.__text=e,t.EventProvider.raise(this.__id+".onPropertyChanged",{propertyName:"Text"}),this.__processText())}getText(){return this.__text}__processText(){this.__elementContentTextSpan[0].textContent=tchmi_decode_control_characters(this.__text)}setTextPadding(valueNew){let e=t.ValueConverter.toObject(valueNew);null===e&&(e=this.getAttributeDefaultValueInternal("TextPadding"));let o=this.__objectResolvers.get("textPadding");o&&(o.watchDestroyer&&o.watchDestroyer(),o.resolver.destroy());let s=new t.Symbol.ObjectResolver(e);this.__objectResolvers.set("textPadding",{resolver:s,watchCallback:this.__onResolverForTextPaddingWatchCallback,watchDestroyer:s.watch(this.__onResolverForTextPaddingWatchCallback)})}getTextPadding(){return this.__textPadding}__processTextPadding(){t.StyleProvider.processContentPadding(this.__elementContentTextSpan,this.__textPadding)}setTextHorizontalAlignment(valueNew){let e=t.ValueConverter.toHorizontalAlignment(valueNew);null===e&&(e=this.getAttributeDefaultValueInternal("TextHorizontalAlignment")),e!==this.__textHorizontalAlignment&&(this.__textHorizontalAlignment=e,t.EventProvider.raise(this.__id+".onPropertyChanged",{propertyName:"TextHorizontalAlignment"}),this.__processTextHorizontalAlignment())}getTextHorizontalAlignment(){return this.__textHorizontalAlignment}__processTextHorizontalAlignment(){this.__textHorizontalAlignment?this.__elementContentTextSpan[0].style.textAlign=this.__textHorizontalAlignment.toLowerCase():this.__elementContentTextSpan[0].style.textAlign=""}setTextVerticalAlignment(valueNew){let e=t.ValueConverter.toVerticalAlignment(valueNew);null===e&&(e=this.getAttributeDefaultValueInternal("TextVerticalAlignment")),e!==this.__textVerticalAlignment&&(this.__textVerticalAlignment=e,t.EventProvider.raise(this.__id+".onPropertyChanged",{propertyName:"TextVerticalAlignment"}),this.__processTextVerticalAlignment())}getTextVerticalAlignment(){return this.__textVerticalAlignment}__processTextVerticalAlignment(){t.StyleProvider.processContentVerticalAlignment(this.__elementTemplateRoot,this.__textVerticalAlignment)}setIcon(valueNew){let e=t.ValueConverter.toString(valueNew);null===e&&(e=this.getAttributeDefaultValueInternal("Icon")),e!==this.__icon.image&&(this.__icon.image=e,t.EventProvider.raise(this.__id+".onPropertyChanged",{propertyName:"Icon"}),this.__processIcon())}getIcon(){return this.__icon.image}__processIcon(){this.__attributesInitialized&&t.StyleProvider.processBackground(this.__elementTemplateRoot,this.__icon)}setIconPadding(valueNew){let e=t.ValueConverter.toObject(valueNew);null===e&&(e=this.getAttributeDefaultValueInternal("IconPadding"));let o=this.__objectResolvers.get("iconPadding");o&&(o.watchDestroyer&&o.watchDestroyer(),o.resolver.destroy());let s=new t.Symbol.ObjectResolver(e);this.__objectResolvers.set("iconPadding",{resolver:s,watchCallback:this.__onResolverForIconPaddingWatchCallback,watchDestroyer:s.watch(this.__onResolverForIconPaddingWatchCallback)})}getIconPadding(){return this.__icon.imagePadding}__processIconPadding(){this.__processIcon()}setIconWidth(valueNew){let e=t.ValueConverter.toNumber(valueNew);null===e&&(e=this.getAttributeDefaultValueInternal("IconWidth")),e!==this.__icon.imageWidth&&(this.__icon.imageWidth=e,t.EventProvider.raise(this.__id+".onPropertyChanged",{propertyName:"IconWidth"}),this.__processIconWidth())}getIconWidth(){return this.__icon.imageWidth}__processIconWidth(){this.__processIcon()}setIconWidthUnit(valueNew){let e=t.ValueConverter.toDimensionUnit(valueNew);null===e&&(e=this.getAttributeDefaultValueInternal("IconWidthUnit")),e!==this.__icon.imageWidthUnit&&(this.__icon.imageWidthUnit=e,t.EventProvider.raise(this.__id+".onPropertyChanged",{propertyName:"IconWidthUnit"}),this.__processIconWidthUnit())}getIconWidthUnit(){return this.__icon.imageWidthUnit}__processIconWidthUnit(){this.__processIcon()}setIconHeight(valueNew){let e=t.ValueConverter.toNumber(valueNew);null===e&&(e=this.getAttributeDefaultValueInternal("IconHeight")),e!==this.__icon.imageHeight&&(this.__icon.imageHeight=e,t.EventProvider.raise(this.__id+".onPropertyChanged",{propertyName:"IconHeight"}),this.__processIconHeight())}getIconHeight(){return this.__icon.imageHeight}__processIconHeight(){this.__processIcon()}setIconHeightUnit(valueNew){let e=t.ValueConverter.toDimensionUnit(valueNew);null===e&&(e=this.getAttributeDefaultValueInternal("IconHeightUnit")),e!==this.__icon.imageHeightUnit&&(this.__icon.imageHeightUnit=e,t.EventProvider.raise(this.__id+".onPropertyChanged",{propertyName:"IconHeightUnit"}),this.__processIconHeightUnit())}getIconHeightUnit(){return this.__icon.imageHeightUnit}__processIconHeightUnit(){this.__processIcon()}setIconHorizontalAlignment(valueNew){let e=t.ValueConverter.toHorizontalAlignment(valueNew);null===e&&(e=this.getAttributeDefaultValueInternal("IconHorizontalAlignment")),e!==this.__icon.imageHorizontalAlignment&&(this.__icon.imageHorizontalAlignment=e,t.EventProvider.raise(this.__id+".onPropertyChanged",{propertyName:"IconHorizontalAlignment"}),this.__processIconHorizontalAlignment())}getIconHorizontalAlignment(){return this.__icon.imageHorizontalAlignment}__processIconHorizontalAlignment(){this.__processIcon()}setIconVerticalAlignment(valueNew){let e=t.ValueConverter.toVerticalAlignment(valueNew);null===e&&(e=this.getAttributeDefaultValueInternal("IconVerticalAlignment")),e!==this.__icon.imageVerticalAlignment&&(this.__icon.imageVerticalAlignment=e,t.EventProvider.raise(this.__id+".onPropertyChanged",{propertyName:"IconVerticalAlignment"}),this.__processIconVerticalAlignment())}getIconVerticalAlignment(){return this.__icon.imageVerticalAlignment}__processIconVerticalAlignment(){this.__processIcon()}setTextColor(valueNew){let e=t.ValueConverter.toObject(valueNew);null===e&&(e=this.getAttributeDefaultValueInternal("TextColor"));let o=this.__objectResolvers.get("textColor");o&&(o.watchDestroyer&&o.watchDestroyer(),o.resolver.destroy());let s=new t.Symbol.ObjectResolver(e);this.__objectResolvers.set("textColor",{resolver:s,watchCallback:this.__onResolverForTextColorWatchCallback,watchDestroyer:s.watch(this.__onResolverForTextColorWatchCallback)})}getTextColor(){return this.__textColor}__processTextColor(){t.StyleProvider.processTextColor(this.__element,this.__textColor)}setTextFontSize(valueNew){let e=t.ValueConverter.toNumber(valueNew);null===e&&(e=this.getAttributeDefaultValueInternal("TextFontSize")),e!==this.__textFontSize&&(this.__textFontSize=e,t.EventProvider.raise(this.__id+".onPropertyChanged",{propertyName:"TextFontSize"}),this.__processTextFontSize())}getTextFontSize(){return this.__textFontSize}__processTextFontSize(){t.StyleProvider.processFontSize(this.__elementContentTextSpan,this.__textFontSize,this.__textFontSizeUnit)}setTextFontSizeUnit(valueNew){let e=t.ValueConverter.toFontSizeUnit(valueNew);null===e&&(e=this.getAttributeDefaultValueInternal("TextFontSizeUnit")),e!==this.__textFontSizeUnit&&(this.__textFontSizeUnit=e,t.EventProvider.raise(this.__id+".onPropertyChanged",{propertyName:"TextFontSizeUnit"}),this.__processTextFontSizeUnit())}getTextFontSizeUnit(){return this.__textFontSizeUnit}__processTextFontSizeUnit(){t.StyleProvider.processFontSize(this.__elementContentTextSpan,this.__textFontSize,this.__textFontSizeUnit)}setTextFontFamily(valueNew){let e=t.ValueConverter.toFontFamily(valueNew);null===e&&(e=this.getAttributeDefaultValueInternal("TextFontFamily")),e!==this.__textFontFamily&&(this.__textFontFamily=e,t.EventProvider.raise(this.__id+".onPropertyChanged",{propertyName:"TextFontFamily"}),this.__processTextFontFamily())}getTextFontFamily(){return this.__textFontFamily}__processTextFontFamily(){t.StyleProvider.processFontFamily(this.__elementContentTextSpan,this.__textFontFamily)}setTextFontStyle(valueNew){let e=t.ValueConverter.toFontStyle(valueNew);null===e&&(e=this.getAttributeDefaultValueInternal("TextFontStyle")),e!==this.__textFontStyle&&(this.__textFontStyle=e,t.EventProvider.raise(this.__id+".onPropertyChanged",{propertyName:"TextFontStyle"}),this.__processTextFontStyle())}getTextFontStyle(){return this.__textFontStyle}__processTextFontStyle(){t.StyleProvider.processFontStyle(this.__elementContentTextSpan,this.__textFontStyle)}setTextFontWeight(valueNew){let e=t.ValueConverter.toFontWeight(valueNew);null===e&&(e=this.getAttributeDefaultValueInternal("TextFontWeight")),e!==this.__textFontWeight&&(this.__textFontWeight=e,t.EventProvider.raise(this.__id+".onPropertyChanged",{propertyName:"TextFontWeight"}),this.__processTextFontWeight())}getTextFontWeight(){return this.__textFontWeight}__processTextFontWeight(){t.StyleProvider.processFontWeight(this.__elementContentTextSpan,this.__textFontWeight)}setWordWrap(valueNew){let e=t.ValueConverter.toBoolean(valueNew);null===e&&(e=this.getAttributeDefaultValueInternal("WordWrap")),e!==this.__wordWrap&&(this.__wordWrap=e,t.EventProvider.raise(this.__id+".onPropertyChanged",{propertyName:"WordWrap"}),this.__processWordWrap())}getWordWrap(){return this.__wordWrap}__processWordWrap(){this.__wordWrap?(this.__elementContentTextSpan[0].style.whiteSpace="pre-wrap",this.__elementContentTextSpan[0].style.wordWrap="break-word",this.__elementContentTextSpan[0].style.overflowWrap="break-word"):(this.__elementContentTextSpan[0].style.whiteSpace="",this.__elementContentTextSpan[0].style.wordWrap="",this.__elementContentTextSpan[0].style.overflowWrap="")}__onStateSymbolWatch(){return e=>{e.error===t.Errors.NONE?!1!==e.value&&!0!==e.value||this.__processState(e.value,!1,this.__stateSymbol.getExpression().toString()):e.details&&TCHMI_CONSOLE_LOG_LEVEL>=1&&t.Log.error("[Source=Control, Module=TcHmi.Controls.Beckhoff.TcHmiButton, Id="+this.getId()+", Property=StateSymbol, "+(this.__stateSymbol?"Symbol = "+this.__stateSymbol.getExpression().toString():"")+"] "+t.Log.buildMessage(e.details))}}setStateSymbol(valueNew){let e=valueNew;if(null===e){let o=this.getAttributeDefaultValueInternal("StateSymbol");o&&(e=new t.Symbol(o))}this.__stateSymbol!==e&&(this.__destroyStateSymbolWatch&&(this.__destroyStateSymbolWatch(),this.__destroyStateSymbolWatch=null),e instanceof t.Symbol?(this.__stateSymbol=e,this.__destroyStateSymbolWatch=this.__stateSymbol.watch(this.__onStateSymbolWatch())):void 0===this.__stateSymbol?this.__stateSymbol=null:(this.__stateSymbol=null,this.__processState(!1,!1,"attribute")),t.EventProvider.raise(this.__id+".onPropertyChanged",{propertyName:"StateSymbol"}))}getStateSymbol(){return this.__stateSymbol}}e.TcHmiButton=o}(o=e.Beckhoff||(e.Beckhoff={})),e.registerEx("TcHmiButton","TcHmi.Controls.Beckhoff",t.Controls.Beckhoff.TcHmiButton)}(e=t.Controls||(t.Controls={}))}(TcHmi||(TcHmi={}));