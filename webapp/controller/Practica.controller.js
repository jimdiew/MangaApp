sap.ui.define([
    "./BaseController",
     "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/m/MessageBox",
    "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (BaseController, JSONModel, formatter, MessageBox, ValueHelpDialog) {
		"use strict";
        var oServicio = "/sap/opu/odata/sap/ZOS_ACADEMIA_JIDI3_SRV/";
        var oController;
		return BaseController.extend("com.zacademia.zacademiaej1.controller.Practica", {
            formatter: formatter,

        onInit: function () {
            oController = this;
            this.getManga();
        },

        onCreate: function(){
            
        var obj = {};
        obj.Titulo = sap.ui.core.Fragment.byId("AgregarMangaFrg", "inpTitulo").getValue();
        obj.Autor = sap.ui.core.Fragment.byId("AgregarMangaFrg", "inpAutor").getValue();
        obj.Volumentotal = sap.ui.core.Fragment.byId("AgregarMangaFrg", "inpVolumentotal").getValue();
        obj.Publicacion = sap.ui.core.Fragment.byId("AgregarMangaFrg", "inpPublicacion").getValue();

        if(sap.ui.core.Fragment.byId("AgregarMangaFrg", "cbAdaptacion").getSelectedKey() === "Si"){
            obj.Adaptacion = "X";
        } else {
            obj.Adaptacion = "";
        }

        if(sap.ui.core.Fragment.byId("AgregarMangaFrg", "cbFinalizado").getSelectedKey() === "Si"){
            obj.Finalizado = "X";
        } else {
            obj.Finalizado = "";
        }
            
        /* obj.Genero = this.getView().byId("inpGenero").getValue(); */
                                         
        this.getView().getModel().create("/MangaSet", obj, {
            success: function (oData, oResponse) {
                MessageBox.success("Nuevo manga guardado exitosamente");
            },
            error: function (oError) {
                MessageBox.error("Error al guardar");
            }
        });

        },

        readManga: function(){
            this.getView().getModel().read("/MangaSet"(Isbn={vIsbn}), {
                success: function (oData, oResponse) {
                var oModel = new JSONModel({});
                var oManga = {};
                oManga = oData;

                if(oData.Adaptacion === "X"){
                    oManga.Adaptacion = "Si";
                } else {
                    oManga.Adaptacion = "No";
                }

                 if(oData.Finalizado === "X"){
                    oManga.Finalizado = "Si";
                } else {
                    oManga.Finalizado = "En Emision";
                }

                oModel.setData(oManga);
                oController.getView().setModel("oModelManga", oModel);

                },

                error: function (oError) {
                    MessageBox.error("Error al buscar manga");
                }
            });

        },

        deleteManga: function(){
            this.getView().getModel().remove("/MangaSet"(Isbn={vIsbn}), {
                success: function (oData, oResponse) {
                MessageBox.success("Manga borrado exitosamente");
                },

                error: function (oError) {
                    MessageBox.error("Error al borrar manga");
                }
            });

        },

            getManga: function (){
                 var oModel = new sap.ui.model.odata.v2.ODataModel(oServicio);
                //var oModel = this.getView().getModel();
                this.getView().byId("tableManga").setBusy(true);
                oModel.read("/MangaSet", {
				success: function (oData) {
                    if (oData.results.length > 0){
                        var oModelManga = new JSONModel();
                        oModelManga.setData(oData.results);
                        oController.getView().byId("tableManga").setModel(oModelManga, "Manga");
                        }
                    this.getView().byId("tableManga").setBusy(false);
                    }.bind(this),
                    error: function(){
                        sap.m.MessageToast.show("Error de conexion a SAP");
                        this.getView().byId("tableManga").setBusy(false);
                    }.bind(this)
                });
            },

             onNavegarAVolumen: function (oEvent){
                // Navego a la vista de Volumen con el ISBN del manga elegido
                //var ObjectManga = oEvent.getSource().getBindingContext().getProperty(oEvent.getSource().getBindingContextPath()); Con esto obtengo TODO el objeto
                var vIsbn = oEvent.getSource().getBindingContext().getProperty("Isbn"); //Con esto obtengo solo la propiedad CUIL del objeto
                this.getRouter().navTo("volumen", {
                    Isbn: vIsbn
                });
            },

            onFilterManga: function (){

                var vIsbn = this.getView().byId("_filterIsbn").getValue();
                var vGeneros = this.getView().byId("_filterGeneros").getValue();
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
                if (vIsbn){
                    aFilter.push(new sap.ui.model.Filter("Isbn", sap.ui.model.FilterOperator.EQ, vIsbn));
                }

                if (vGeneros){
                    aFilter.push(new sap.ui.model.Filter("Generos", sap.ui.model.FilterOperator.EQ, vGeneros));
                }

                var oModel = this.getView().getModel();
                this.getView().byId("tableManga").setBusy(true);
                oModel.read("/MangaSet", {
                    filters: aFilter,
                   success: function (oData, oResponse) {
                  if (oData.results.length > 0){
                            var oModelManga = new JSONModel();
                            
                            //Si quiero filtrar tabla que tiene modelo default
                            this.getView().setModel(oModelManga);
                            oModelManga.setProperty("/MangaSet", oData.results);
                            //oController.getView().byId("tableManga").setModel(oModelManga);
                            
                            //Si quiero filtrar tabla que tiene modelo local
                            //oModelManga.setData(oData.results);
                            //oController.getView().byId("tableManga").setModel(oModelManga, "Volumen");
                       }
                        this.getView().byId("tableManga").setBusy(false);
                    }.bind(this),
                    error: function (oError) {
                        sap.m.MessageToast.show("Error de conexion a SAP");
                        this.getView().byId("tableManga").setBusy(false);
                    }.bind(this)
                });

            },

            onValueGeneros: function(){
                var oVista = this.getView();
                var oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
                    title: "Elegir Género del Manga",
                    supportMultiselect: false,
                    ok: function (oControlEvent) {
                        var oTable = oValueHelpDialog.getTable();
                        var indice = oTable.getSelectedIndex();
                        var selection = oTable.getContextByIndex(indice);
                        var eInput = oVista.byId("_filterGeneros");
                        eInput.setValue(selection.getProperty("IdGenero"));
                        oController.onFilterManga();
                        oValueHelpDialog.close();
                    },
                    cancel: function (oControlEvent){
                        oValueHelpDialog.close();
                    },
                    afterClose: function(){
                        this.destroy();
                        oValueHelpDialog = null;
                    }

                });

                var oModel = oController.getView().getModel();
                var url = oModel.sServiceUrl + "/GeneroSet?$format-json";
                var oJson = new sap.ui.model.json.JSONModel();
                oJson.loadData(url, "", false);
                var oColModel = new sap.ui.model.json.JSONModel();
                oColModel.setData({
                    cols: [{
                        label: "Id del Género",
                        template: "IdGenero"
                    }, {
                        label: "Detalle del Género",
                        template: "DescGenero"
                    }]
                });

                oValueHelpDialog.getTable().setModel(oColModel, "columns");
                var oRowsModel = new sap.ui.model.json.JSONModel();
                var oItems = oJson.getData();
                var aItems = oItems.d.results;
                oRowsModel.setData(aItems);
                oValueHelpDialog.getTable().setModel(oRowsModel);
                oValueHelpDialog.getTable().bindRows("/");
                oValueHelpDialog.getTable().setSelectionBehavior(sap.ui.table.SelectionBehavior.RowOnly);
                oValueHelpDialog.getTable().sort(oValueHelpDialog.getTable().getColumns()[0]);
                oValueHelpDialog.open();
                

            },

            onClickAgregarMangaFrg: function() {
                if(!this.AgregarMangaFrg) {
                    this.AgregarMangaFrg =  sap.ui.xmlfragment("AgregarMangaFrg", "com.zacademia.zacademiaej1.view.AgregarManga", this);  //mi fragment
                    this.getView().addDependent(this.AgregarMangaFrg);
                    this.AgregarMangaFrg.setModel(this.getView().getModel("MatchManga"), "MatchManga");
                }
                this.AgregarMangaFrg.open();
            },

            closeAgregarMangaFrg: function(oEvent){
                this.AgregarMangaFrg.close();
            }

		});
	});
