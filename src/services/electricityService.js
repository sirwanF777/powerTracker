// ./src/services/electricityService.js
const apiError = require("../utils/apiError");
const electricityModel = require("../models/electricityModel");

const consumption = async (userName, type) => {
    try {
        const data = await electricityModel.find({ userName, participationPhase: 'Phase_2' });
        if (!data || data.length === 0) {
            throw new apiError(404, "No data found for the given user");
        }

        switch (type) {
            case 'hourly':
                return data.map(item => ({
                    hour: item.hour,
                    demand: item.demand_kWh,
                }));
            case 'daily':
                return groupByDate(data, 'daily');
            case 'weekly':
                return groupByDate(data, 'weekly');
            case 'monthly':
                return groupByDate(data, 'monthly');
            default:
                throw new apiError(400, "Invalid type parameter");
        }
    } catch (error) {
        throw (error instanceof apiError ? error : new apiError(400, error.message));
    }
};

const groupByDate = (data, period) => {
    const grouped = {};
    data.forEach(item => {
        const dateKey = generateDateKey(item.date, period);
        if (!grouped[dateKey]) {
            grouped[dateKey] = 0;
        }
        grouped[dateKey] += item.demand_kWh;
    });

    return Object.entries(grouped).map(([key, demand]) => ({ period: key, demand }));
};

const generateDateKey = (date, period) => {
    const d = new Date(date);
    if (period === 'daily') return d.toISOString().split('T')[0];
    if (period === 'weekly') return getWeekStartDate(d);
    if (period === 'monthly') return `${d.getFullYear()}-${d.getMonth() + 1}`;
};

const getWeekStartDate = (date) => {
    const currentDate = new Date(date);
    const dayOfWeek = currentDate.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek.toISOString().split('T')[0];
};

module.exports = {
    consumption,
};
