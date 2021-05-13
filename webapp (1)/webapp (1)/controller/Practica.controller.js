sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    
	function (BaseController, JSONModel, formatter) {
		"use strict";
        var oServicio = "/sap/opu/odata/sap/ZOS_ACADEMIA_LUUC3_SRV/";
        var oController;
		return BaseController.extend("com.pampa.zacademiaej.controller.Practica", {
            
            formatter: formatter,

			onInit: function () {
                oController = this;
                this.getRestaurants();
            },

            getRestaurants: function (){

                var oModel = new sap.ui.model.odata.v2.ODataModel(oServicio);
                //var oModel = this.getView().getModel();

                this.getView().byId("tableResto").setBusy(true);
                oModel.read("/RestaurantSet", {
                    success: function (oData) {
                        if (oData.results.length > 0){
                            var oModelResto = new JSONModel();
                            oModelResto.setData(oData.results);
                            oController.getView().byId("tableResto").setModel(oModelResto, "Resto");
                        }
                        this.getView().byId("tableResto").setBusy(false);
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show("Error de conexion a SAP");
                        this.getView().byId("tableResto").setBusy(false);
                    }.bind(this)
			    });
            },
            
            onNavegarAPlatos: function (oEvent){
                // Navego a la vista de Platos con el ID de restaurant elegido
                
                //var ObjectRestaurant = oEvent.getSource().getBindingContext().getProperty(oEvent.getSource().getBindingContextPath()); Con esto obtengo TODO el objeto
                var vCuil = oEvent.getSource().getBindingContext().getProperty("Cuil"); //Con esto obtengo solo la propiedad CUIL del objeto
                this.getRouter().navTo("platos", {
                    Cuil: vCuil
                });
            },

            onFilterRestaurants: function (){

                var vCuil = this.getView().byId("_filterCuil").getValue();
                var aFilter = [];

                //Filtro en vista no va a Backend
                //this.getView().byId("tableResto").getBinding("items").filter(aFilter);
                //var oFilter = new sap.ui.model.Filter({
                //            path: "Cuil",
                //            value1: vCuil,
                //            operator: 'EQ'
                //        });
                //        aFilter.push(oFilter);
                
                //Filtro en ABAP
                if (vCuil){
                    aFilter.push(new sap.ui.model.Filter("Cuil", sap.ui.model.FilterOperator.EQ, vCuil));
                }

                var oModel = this.getView().getModel();
                this.getView().byId("tableResto").setBusy(true);
                oModel.read("/RestaurantSet", {
                    filters: aFilter,
                   success: function (oData, oResponse) {
                  if (oData.results.length > 0){
                            var oModelResto = new JSONModel();
                            
                            //Si quiero filtrar tabla que tiene modelo default
                            oModelResto.setProperty("/RestaurantSet", oData.results);
                            oController.getView().byId("tableResto").setModel(oModelResto);
                            
                            //Si quiero filtrar tabla que tiene modelo local
                            //oModelResto.setData(oData.results);
                            //oController.getView().byId("tableResto").setModel(oModelResto, "Resto");
                       }
                        this.getView().byId("tableResto").setBusy(false);
                    }.bind(this),
                    error: function (oError) {
                        sap.m.MessageToast.show("Error de conexion a SAP");
                        this.getView().byId("tableResto").setBusy(false);
                    }.bind(this)
                });

            }

        });
	});
