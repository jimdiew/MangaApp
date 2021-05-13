sap.ui.define([], function () {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function (sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
        },

//Adaptacion        
textoAdaptacion: function (vAdaptacion) { 
    if (vAdaptacion){
        return "Si" 
        
    }else{
        return "No"
    }
},
        
//HighlightFinalizado


highlightFinalizado: function (vFinalizado) {
    if (vFinalizado){
        return "Success"
    }else{
        return "Error"
    }
},

stateFinalizado: function (vFinalizado) {
    if (vFinalizado){
        return "Success"
    }else{
        return "Error"
    }
},

textoFinalizado: function (vFinalizado) { 
    if (vFinalizado){
        return "Si" 
        
    }else{
        return "En Emision"
    }
},


//Cantidad stock

 highlightCantidadstock: function (vCantidadstock) {
            if (vCantidadstock > 0){
                return "Success"
            }else{
                return "Error"
            }
        },


}
;})