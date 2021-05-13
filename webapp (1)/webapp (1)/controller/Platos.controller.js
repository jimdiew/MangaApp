sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "../model/formatter",
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    
	function (BaseController, JSONModel, History, formatter) {
		"use strict";
        var oServicio = "/sap/opu/odata/sap/ZOS_ACADEMIA_LUUC3_SRV/";
        var oController;
		return BaseController.extend("com.pampa.zacademiaej.controller.Platos", {
            
            formatter: formatter,

			onInit: function () {
                oController = this;
                
                /*
                * a. Obtener el CUIL que me estan pasando
                * b. Con ese CUIL tengo que obtener los platos de ese CUIL (Navigation Property de Restaurant->Platos) GET_ENTITYSET de Platos pasandole el CUIL 
                */
                this.getRouter().getRoute("platos").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oEvent) {
                oController.Cuil = oEvent.getParameter("arguments").Cuil;
                var oModel = new sap.ui.model.odata.v2.ODataModel(oServicio);
                    //var oModel = this.getView().getModel();

                this.getView().byId("tablePlatos").setBusy(true);

                // Entro por el Navigation property /RestaurantSet('20336801998')/PlatosSet
                var sPath = oModel.createKey("/RestaurantSet", {
                    Cuil: oController.Cuil
                });

                //var sPath = "/RestaurantSet('" + oController.Cuil + "')/PlatosSet";
                sPath = sPath + "/PlatosSet";

                oModel.read(sPath, {
                    success: function (oData) {
                        if (oData.results.length > 0){
                            var oModelPlatos = new JSONModel();
                            oModelPlatos.setData(oData.results);
                            oController.getView().byId("tablePlatos").setModel(oModelPlatos, "Platos");
                        }
                        this.getView().byId("tablePlatos").setBusy(false);
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show("Error de conexion a SAP al obtener los Platos");
                        this.getView().byId("tablePlatos").setBusy(false);
                    }.bind(this)
                });
                
            },

            onNavBack:function (){
                oController.getView().byId("tablePlatos").setModel(null);
                var oRouter = oController.getOwnerComponent().getRouter();
                oController.getView().unbindElement();
                var oHistory = History.getInstance(),
                    sPreviousHash = oHistory.getPreviousHash();
                if (sPreviousHash !== undefined) {
                    history.go(-1);
                } else {
                    var bReplace = true;
                    oRouter.navTo("RoutePractica", {}, bReplace);
                }
            }
  
        });
	});
