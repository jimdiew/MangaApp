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
        var oServicio = "/sap/opu/odata/sap/ZOS_ACADEMIA_JIDI3_SRV/";
        var oController;
		return BaseController.extend("com.zacademia.zacademiaej1.controller.Volumen", {
            formatter: formatter,

			onInit: function () {
                oController = this;
                this.getRouter().getRoute("volumen").attachPatternMatched(this._onObjectMatched,this);
            },

            _onObjectMatched: function (oEvent) {
                oController.Isbn = oEvent.getParameter("arguments").Isbn;
                var oModel = new sap.ui.model.odata.v2.ODataModel(oServicio);
                    //var oModel = this.getView().getModel();

                this.getView().byId("tableVolumen").setBusy(true);

                // Entro por el Navigation property /RestaurantSet('20336801998')/PlatosSet
                var sPath = oModel.createKey("/MangaSet", {
                    Isbn: oController.Isbn
                });

                //var sPath = "/RestaurantSet('" + oController.Cuil + "')/PlatosSet";
                sPath = sPath + "/VolumenSet";

                oModel.read(sPath, {
                    success: function (oData) {
                        if (oData.results.length > 0){
                            var oModelVolumen = new JSONModel();
                            oModelVolumen.setData(oData.results);
                            oController.getView().byId("tableVolumen").setModel(oModelVolumen, "Volumen");
                        }
                        this.getView().byId("tableVolumen").setBusy(false);
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show("Error de conexion a SAP al obtener los Volumenes");
                        this.getView().byId("tableVolumen").setBusy(false);
                    }.bind(this)
                });
                
            },

             onNavBack:function (){
                oController.getView().byId("tableVolumen").setModel(null);
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
