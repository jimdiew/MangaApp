/*global QUnit*/

sap.ui.define([
	"compampa./zacademiaej/controller/Practica.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Practica Controller");

	QUnit.test("I should test the Practica controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
