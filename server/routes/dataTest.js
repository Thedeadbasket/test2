import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require('express');
const router = express.Router();
import TestFormat from "../models/SaveFormat.js";
import {getNewSave} from  "../EstimationController.js"



/**
 * @swagger
 * /data:
 *   get:
 *     summary: Gibt alle gespeicherten Daten zurück
 *     responses:
 *       200:
 *         description: Erfolgreiche Antwort mit den gespeicherten Daten
 */
router.get('/', async (req, res) => {
    try {
        const NewSaves = await TestFormat.find(undefined, undefined, undefined);
        res.json(NewSaves);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/staffing/all', async (req, res) => {
    try {
        // Suche alle Einträge und hole nur das 'staffing'-Feld
        const staffingValue = await TestFormat.find({}, { staffing: 1 });

        console.log('Abgerufene Daten:', staffingValue);

        if (staffingValue.length === 0) {
            return res.status(404).json({ message: 'Keine Einträge gefunden' });
        }

        // Extrahiere alle 'staffing'-Daten aus jedem Eintrag
        const staffingList = staffingValue.flatMap(item => item.staffing);

        console.log('Flache Staffing-Liste:', staffingList);

        // Gibt die Liste der Staffing-Daten als Antwort zurück
        res.json(staffingList);
    } catch (err) {
        // Fehlerbehandlung
        console.error('Fehler:', err);
        res.status(500).json({ error: 'Fehler beim Laden der Daten', message: err.message });
    }
});



/**
 * @swagger
 * /data/{fileName}:
 *   get:
 *     summary: Gibt die Daten für eine bestimmte Datei zurück
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         description: Der Dateiname, nach dem gesucht werden soll
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Erfolgreiche Antwort mit den Daten
 *       404:
 *         description: Datei nicht gefunden
 */
router.get('/:fileName', async (req, res) => {
    try {
        const fileName = req.params.fileName;


        const save = await TestFormat.findOne({ fileName }, undefined, undefined);

        if (!save) {
            return res.status(404).json({ message: 'Eintrag nicht gefunden' });
        }

        res.json(save);
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Laden der Daten' });
    }
});
/**
 * @swagger
 * /data/find/allFileNames:
 *   get:
 *     summary: Gibt alle gespeicherten FileNames zurück
 *     responses:
 *       200:
 *         description: Erfolgreiche Antwort mit den gespeicherten Daten
 */
router.get('/find/allFileNames', async (req, res) => {
    try {

        const fileNames = await TestFormat.find({}, { fileName: 1 }, undefined);

        if (!fileNames.length) {
            return res.status(404).json({ message: 'Keine Einträge gefunden' });
        }


        const fileNameList = fileNames.map(item => item.fileName);

        res.json(fileNameList);
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Laden der Daten' });
    }
});

/**
 * @swagger
 * /data:
 *   post:
 *     summary: Speichert neue Daten
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               Estimation:
 *                 type: object
 *                 properties:
 *                   epicGroup: { type: string }
 *                   epic: { type: string }
 *                   story: { type: string }
 *                   task: { type: string }
 *                   track: { type: string }
 *                   estimate: { type: string }
 *                   resultingEstimate: { type: string }
 *                   override: { type: string }
 *               Risks:
 *                 type: object
 *                 properties:
 *                   objectiveRisk: { type: string }
 *                   impactInDays: { type: number }
 *                   likelihoodInPercent: { type: string }
 *                   teamMultiplier: { type: number }
 *                   riskbuffer: { type: number }
 *                   affectedTrack: { type: string }
 *               Metric:
 *                 type: object
 *                 properties:
 *                   metrics: { type: string }
 *                   Time:
 *                     type: object
 *                     properties:
 *                       times: { type: number }
 *               Tracks:
 *                 type: object
 *                 properties:
 *                   tracks: { type: string }
 *     responses:
 *       201:
 *         description: Erfolgreich gespeichert
 */
router.post('/', async (req, res) => {

    if (!req.body.fileName || !req.body.estimation || !req.body.risks || !req.body.metric || !req.body.tracks) {
        return res.status(400).json({ message: 'Fehlende erforderliche Felder im Request Body' });
    }

    try {
        // Erstelle ein neues Dokument basierend auf den übermittelten Daten
        const NewSave = new TestFormat({
            fileName: req.body.fileName,
            estimation: req.body.estimation,
            risks: req.body.risks,
            metric: req.body.metric,
            tracks: req.body.tracks,
            staffing: req.body.staffing,
        });


        const newSave = await NewSave.save();


        res.status(201).json(newSave);
    } catch (err) {

        res.status(400).json({ message: err.message });
    }
});




/**
 * @swagger
 * /data/{fileName}:
 *   patch:
 *     summary: Aktualisiert bestimmte Felder eines gespeicherten Dokuments anhand des fileName
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Erfolgreich aktualisiert
 *       400:
 *         description: Validierungsfehler oder ungültige Daten
 *       404:
 *         description: Eintrag nicht gefunden
 */
router.patch('/:fileName', async (req, res) => {
    try {
        const fileName = req.params.fileName;

        const updated = await TestFormat.findOneAndUpdate(
            { fileName },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Eintrag nicht gefunden' });
        }

        res.json(updated);
    } catch (err) {
        // Mongoose Validierungsfehler behandeln
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validierungsfehler', details: err.errors });
        }
        res.status(500).json({ message: 'Serverfehler', error: err.message });
    }
});


/**
 * @swagger
 * /data/{id}:
 *   delete:
 *     summary: Löscht einen Eintrag anhand der ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID des zu löschenden Eintrags
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Erfolgreich gelöscht
 *       404:
 *         description: Eintrag nicht gefunden
 */
router.delete('/:fileName', getNewSave, async (req, res) => {
    try {
        await req.NewSave.deleteOne();
        res.json({ message: 'Deleted NewSave' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

import { isValidObjectId } from 'mongoose';






export default router;
