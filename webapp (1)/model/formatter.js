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

		highlightHabilitado: function (vHabilitado) {
            if (vHabilitado === "X"){
                return "Success"
            }else{
                return "Error"
            }
		},

        stateHabilitado: function (vHabilitado) {
            if (vHabilitado === "X"){
                return "Success"
            }else{
                return "Error"
            }
		},

        textoHabilitado: function (vHabilitado) {
            if (vHabilitado === "X"){
                return "Si"
            }else{
                return "No"
            }
		},

		aptoCeliaco: function (vApto) {
            if (vApto === "X"){
                return "Si"
            }else{
                return "No"
            }
		}
	};

});