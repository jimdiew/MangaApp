sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, JSONModel) {
	"use strict";

	var oController;
	return Controller.extend("ns.Academia.controller.Principal", {
		onInit: function () {
			oController = this;

		},

		onCreate: function () {
			oController = this;
			var obj = {};
			obj.Cuil = "20336801998";
			obj.IdPlato = "4";
			obj.Nombre = this.getView().byId("inpNombre").getValue();
			obj.Tipo = this.getView().byId("inpTipo").getValue();
			obj.Precio = this.getView().byId("inpPrecio").getValue();
			if (this.getView().byId("cbApto").getSelectedKey() === "SI") {
				obj.AptoCeliaco = "X";
			} else {
				obj.AptoCeliaco = "";
			}
			this.getView().getModel().create("/PlatosSet", obj, {
				success: function (oData, oResponse) {
					MessageBox.success("Guardado exitosamente");
				},
				error: function (oError) {
					MessageBox.error("Error al guardar");
				}
			});

		},

		leerPlato: function () {
			this.getView().getModel().read("/PlatosSet(Cuil='20336801998',IdPlato='1')", {
				success: function (oData, oResponse) {
					var oModel = new JSONModel({});
					var oPlato = {};
					oPlato = oData;
					if(oData.AptoCeliaco === 'X'){
						oPlato.AptoCeliaco = "SI";
					} else {
						oPlato.AptoCeliaco = "NO";
					}
					oModel.setData(oPlato);
					oController.getView().setModel("oModelPlato", oModel);
				},
				error: function (oError) {
					MessageBox.error("Error al buscar plato");
				}
			});
		},
		
		traerPlatos: function () {
			this.getView().getModel().read("/RestaurantSet", {
				success: function (oData, oResponse) {
					var restaurants = oData.results;
				},
				error: function (oError) {
					MessageBox.error("Error al buscar plato");
				}
			});
		},
		
		borrarPlato: function (oEvent) {
			var sPath = oEvent.getSource().getBindingContext().getPath();
			this.getView().getModel().remove(sPath, {
				success: function (oData, oResponse) {
					MessageBox.success("Plato Borrado");
				},
				error: function (oError) {
					MessageBox.error("Error al borrar plato");
				}
			});
		},
		
		updatePlato: function () {
			oController = this;
			var obj = {};
			obj.Cuil = "20336801998";
			obj.Nombre = this.getView().byId("inpNombre").getValue();
			obj.Tipo = this.getView().byId("inpTipo").getValue();
			obj.Precio = this.getView().byId("inpPrecio").getValue();
			if (this.getView().byId("cbApto").getSelectedKey() === "SI") {
				obj.AptoCeliaco = "X";
			} else {
				obj.AptoCeliaco = "";
			}
			// var sPath = "/PlatosSet(Cuil='20336801998',IdPlato='2')"
			this.getView().getModel().remove("/PlatosSet(Cuil='20336801998',IdPlato='2')", obj, {
				success: function (oData, oResponse) {
					MessageBox.success("Plato Borrado");
				},
				error: function (oError) {
					MessageBox.error("Error al borrar plato");
				}
			});
		}

	});
});