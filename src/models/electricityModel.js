const mongoose = require("mongoose");


const electricitySchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'Username is required.'],
        trim: true,
    },
    date: {
        type: Date,
        required: [true, 'Date is required.'],
    },
    from: {
        type: Date,
        required: [true, 'From date is required.'],
    },
    hour: {
        type: Number,
        required: [true, 'Hour is required.'],
        min: [0, 'Hour must be at least 0.'],
        max: [23, 'Hour cannot exceed 23.'],
    },
    participationPhase: {
        type: String,
        required: [true, 'Participation phase is required.'],
    },
    demand_kWh: {
        type: Number,
        required: [true, 'Demand (kWh) is required.'],
        min: [0, 'Demand cannot be negative.'],
    },
    temperature: {
        type: Number,
        required: [true, 'Temperature is required.'],
    },
    temperature24: {
        type: Number,
        required: [true, 'Temperature24 is required.'],
    },
    temperature48: {
        type: Number,
        required: [true, 'Temperature48 is required.'],
    },
    temperature72: {
        type: Number,
        required: [true, 'Temperature72 is required.'],
    }
}, {
    collection: "electricityConsumption",
});

const electricityModel = mongoose.model("ElectricityConsumption", electricitySchema);


module.exports = electricityModel;
