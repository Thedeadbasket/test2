import TestFormat from "./models/SaveFormat.js";

export async function getNewSave(req, res, next) {
    let NewSave;
    try {
        const { fileName } = req.params;


        if (!fileName) {
            return res.status(400).json({ message: 'Ungültiger fileName' });
        }


        NewSave = await TestFormat.findOne({ fileName: req.params.fileName });

        if (!NewSave) {
            return res.status(404).json({ message: 'Eintrag mit diesem fileName nicht gefunden' });
        }

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    req.NewSave = NewSave;
    next();
}