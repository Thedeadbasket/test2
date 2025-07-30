import mongoose from 'mongoose';

const SaveFormatSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true,
        unique: true
    },
    estimation: [{
        epicGroup: String,
        epic: String,
        story: String,
        task: String,
        track: String,
        estimate: String,
        resultingEstimate: String,
        override: String
    }],
    risks: [{
        objectiveRisk: String,
        impactInDays: String,
        likelihoodInPercent: String,
        teamMultiplier: String,
        riskbuffer: String,
        affectedTrack: String
    }],
    metric: [{
        metrics: String,
        times: String,
    }],

    tracks: [{
        track: String,
        color: String,
        riskbuffer: String,
        resultingEstimate: String,
        totalEstimate: String,
        addins: String,
        delta: String,
        plannedTime: String,
        kw: [{
            period: String,
            value: Number
        }]
    }],

});

export default mongoose.model('SaveFormat', SaveFormatSchema);