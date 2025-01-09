// ./src/services/electricityService.js
const logger = require("../config/logger");
const apiError = require("../utils/apiError");
const electricityModel = require("../models/electricityModel");

const consumption = async (userName, type, startDate, endDate) => {
    try {
        logger.info(`Consumption request received: user=${userName}, type=${type}, startDate=${startDate || "N/A"}, endDate=${endDate || "N/A"}`);

        let data = await electricityModel.find({ userName, participationPhase: 'Phase_2' }).sort({ date: 1 });

        if (!data || data.length === 0) {
            logger.warn(`No data found for user: ${userName}`);
            throw new apiError(404, "No data found for the given user");
        }

        const start = startDate ? new Date(startDate) : new Date(data[0].date);
        const end = endDate ? new Date(endDate) : new Date(data[data.length - 1].date);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            logger.error(`Invalid date format: startDate=${startDate}, endDate=${endDate}`);
            throw new apiError(400, "Invalid date format. Use YYYY-MM-DD.");
        }

        data = data.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= start && itemDate <= end;
        });

        if (data.length === 0) {
            logger.warn(`No data found in the requested date range: user=${userName}, start=${startDate}, end=${endDate}`);
            throw new apiError(404, "No data found in the requested date range");
        }

        let result;
        switch (type) {
            case 'hourly':
                result = data.map(item => ({
                    date: item.date.toISOString().split('T')[0],
                    hour: item.hour,
                    demand: item.demand_kWh,
                }));
                break;
            case 'daily':
                result = groupByDate(data, 'daily');
                break;
            case 'weekly':
                result = groupByDate(data, 'weekly');
                break;
            case 'monthly':
                result = groupByDate(data, 'monthly');
                break;
            default:
                logger.error(`Invalid type parameter: ${type}`);
                throw new apiError(400, "Invalid type parameter");
        }

        logger.info(`Consumption data processed successfully: user=${userName}, type=${type}, records=${result.length}`);
        return result;

    } catch (error) {
        logger.error(`Error processing consumption data: ${error.message}`);
        throw (error instanceof apiError ? error : new apiError(400, error.message));
    }
};



const groupByDate = (data, date) => {
    const grouped = {};
    data.forEach(item => {
        const dateKey = generateDateKey(item.date, date);
        if (!grouped[dateKey]) {
            grouped[dateKey] = 0;
        }
        grouped[dateKey] += item.demand_kWh;
    });

    return Object.entries(grouped).map(([key, demand]) => ({ date: key, demand }));
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
