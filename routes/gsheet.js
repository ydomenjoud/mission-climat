const getSimulatorResults = require('../public/javascripts/getSimulatorResults.js');
const express = require("express");
const router = new express.Router();
const {google} = require('googleapis');
require("dotenv").config();
const {watch, formatNumber } = require('../utils');

/** functions **/
const updateSpreadsheet = (spreadsheetId, values) => sheets.spreadsheets.values.update({
  spreadsheetId,
  range: rangeParams,
  valueInputOption: 'RAW',
  resource: {values}
});

///////// set global vars ////////////
const auth = new google.auth.GoogleAuth({scopes: ['https://www.googleapis.com/auth/drive']});
const drive = google.drive({version: 'v3', auth});
const sheets = google.sheets({version: 'v4', auth});
const rangeParams = 'Paramètres!J3:J31';

///////// define routes ////////////

//copie de la spreadsheet master. Renvoie l'ID de la copie
// + autoriser tout le monde à modifier ce fichier
router.get("/", (req, res) => {
  const fileId = process.env.SPREADSHEET_MASTER_ID;
  console.log(fileId)
  const promise = drive.files.copy({fileId}).then(res => {
    console.log(res.data)
    return drive.permissions.create({
      fileId: res.data.id,
      resource: {
        role: "writer",
        type: "anyone"
      }
    })
      .then(() => ({id: res.data.id}))
      .catch(err => console.log(err))
  });

  watch(promise, res);
});

// téléchargement de la feuille
router.get("/download/:id", (req, res) => {
  const fileId = req.params.id;
  const mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const promise = drive.files.export({fileId, mimeType}).then(results => ({results}));

  watch(promise, res);
});

//route permettant de récupérer les valeurs des paramètres d'une spreadsheet déjà créée
router.get("/values/:id", (req, res) => {

  const spreadsheetId = req.params.id;
  const range = 'Paramètres!F3:J31';

  const promise = sheets.spreadsheets.values
    .get({spreadsheetId, range})
    .then(response => {
      const rows = response.data.values;
      const values = rows.map(row => !isNaN(Number(row[4].replace(",", "."))) ? [formatNumber(row[4], row[0] === "%")] : [row[4]]);
      return {"values": values}
    });

  watch(promise, res);

});


//actualisation de la sheet avec de nouveaux paramètres et renvoi des résultats correspondants
router.patch("/update/:id", (req, res) => {

  // @TODO on ne doit pas pouvoir update la feuille master
  const spreadsheetId = req.params.id;
  const values = req.body.values;
  const rangeOutputs = 'Résultats!A1:BB300';

  const promise = updateSpreadsheet(spreadsheetId, values)
    .then(() => {
      return sheets.spreadsheets.values.get({spreadsheetId, range: rangeOutputs});
    })
    .then(response => {
      const rows = response.data.values;
      const results = getSimulatorResults(rows);
      return {results};
    });

  watch(promise, res);
});


//actualisation de la sheet avec de nouveaux paramètres et c'est tout (utile pour la réinite)
router.patch("/updateonly/:id", (req, res) => {
  // @TODO on ne doit pas pouvoir update la feuille master
  const spreadsheetId = req.params.id;
  const values = req.body.values;
  const promise = updateSpreadsheet(spreadsheetId, values).then(() => ({response: "done"}));

  watch(promise, res);
});


// suppression de la route
router.delete("/delete/:id", (req, res) => {

  // @TODO on ne doit pas pouvoir supprimer la feuille master
  const fileId = req.params.id;
  const promise = drive.files.delete({fileId}).then(() => ({data: "File " + fileId + " deleted"}));

  watch(promise, res);

});

module.exports = router;

