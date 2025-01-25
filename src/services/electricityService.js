// ./src/services/electricityService.js
const logger = require("../config/logger"); // For logging information and errors
const apiError = require("../utils/apiError"); // Custom API error handler
const electricityModel = require("../models/electricityModel"); // Model to fetch electricity data
const ARIMA = require('arima'); // ARIMA library for time-series forecasting


// Main function to handle consumption data requests
const consumption = async (userName, type, startDate, endDate) => {
    try {
        logger.info(`Consumption request received: user=${userName}, type=${type}, startDate=${startDate || "N/A"}, endDate=${endDate || "N/A"}`);

        // Fetch electricity data for the user
        let data = await electricityModel.find({ userName, participationPhase: 'Phase_2' }).sort({ date: 1 });

        // If no data is found, log and throw an error
        if (!data || data.length === 0) {
            logger.warn(`No data found for user: ${userName}`);
            throw new apiError(404, "No data found for the given user");
        }

        // Determine the start and end dates for filtering the data
        const start = startDate ? new Date(startDate) : new Date(data[0].date);
        const end = endDate ? new Date(endDate) : new Date(data[data.length - 1].date);

        // Validate the start and end dates
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            logger.error(`Invalid date format: startDate=${startDate}, endDate=${endDate}`);
            throw new apiError(400, "Invalid date format. Use YYYY-MM-DD.");
        }

        // Filter data based on the requested date range
        data = data.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= start && itemDate <= end;
        });

        // If no data exists in the requested range, log and throw an error
        if (data.length === 0) {
            logger.warn(`No data found in the requested date range: user=${userName}, start=${startDate}, end=${endDate}`);
            throw new apiError(404, "No data found in the requested date range");
        }

        // Process the data based on the type (hourly, daily, weekly, monthly)
        let result;
        switch (type) {
            case 'hourly':
                result = data.map(item => ({
                    date: item.date.toISOString().split('T')[0],
                    hour: item.from.getHours(), // Extract the hour
                    demand: item.demand_kWh.toFixed(3), // Format demand to 3 decimals
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

        // Forecast future consumption using SARIMA
        const predictedData = predictConsumption(result, type);

        logger.info(`Consumption data processed successfully: user=${userName}, type=${type}, records=${result.length}, predictedRecords=${predictedData.length}`);

        return {
            actualData: result, // Actual historical data
            predictedData: predictedData // Forecasted data
        };

    } catch (error) {
        logger.error(`Error processing consumption data: ${error.message}`);
        throw (error instanceof apiError ? error : new apiError(400, error.message));
    }
};

// Function to predict future consumption using SARIMA
const predictConsumption = (data, type) => {
    if (data.length < 4) {
        logger.warn("Not enough data to predict.");
        return [];
    }

    const demandHistory = data.map(d => d.demand);
    let numPredictions = Math.ceil(demandHistory.length / 4);
    numPredictions = numPredictions > 24 ? 24 : numPredictions;

    // Get SARIMA configuration based on the type of data
    const config = getSARIMAConfig(type);

    // Initialize and train the SARIMA model
    const sarima = new ARIMA({
        p: config.p, d: config.d, q: config.q,
        P: config.P, D: config.D, Q: config.Q,
        s: config.s, verbose: false
    });

    sarima.train(demandHistory);
    const [predictions, error] = sarima.predict(numPredictions);

    // Generate future dates based on the type of data
    const lastDate = new Date(data[data.length - 1].date);
    let predictedDates = generateFutureDates(lastDate, predictions.length, type);

    return predictions.map((predictedDemand, index) => ({
        date: predictedDates[index].split("T")[0],
        hour: type === "hourly" ? new Date(predictedDates[index]).getHours() : undefined,
        demand: predictedDemand.toFixed(3)
    }));
};

// Function to get SARIMA configuration based on the type
const getSARIMAConfig = (type) => {
    switch (type) {
        case "hourly":
            return { p: 2, d: 1, q: 2, P: 1, D: 1, Q: 1, s: 24 }; // Seasonal period of 24 hours
        case "daily":
            return { p: 2, d: 1, q: 2, P: 1, D: 1, Q: 1, s: 7 }; // Seasonal period of 7 days
        case "weekly":
            return { p: 1, d: 1, q: 1, P: 1, D: 1, Q: 1, s: 4 }; // Seasonal period of 4 weeks (1 month)
        case "monthly":
            return { p: 1, d: 1, q: 1, P: 1, D: 1, Q: 1, s: 12 }; // Seasonal period of 12 months (1 year)
        default:
            throw new Error("Invalid time type for SARIMA");
    }
};

// Function to generate future dates based on the type
const generateFutureDates = (lastDate, count, type) => {
    let futureDates = [];
    for (let i = 1; i <= count; i++) {
        let nextDate = new Date(lastDate);
        if (type === "hourly") {
            nextDate.setHours(lastDate.getHours() + i);
        } else if (type === "daily") {
            nextDate.setDate(lastDate.getDate() + i);
        } else if (type === "weekly") {
            nextDate.setDate(lastDate.getDate() + (i * 7));
        } else if (type === "monthly") {
            nextDate.setMonth(lastDate.getMonth() + i);
        }
        futureDates.push(nextDate.toISOString());
    }
    return futureDates;
};

// Function to group data by date
const groupByDate = (data, date) => {
    const grouped = {};
    data.forEach(item => {
        const dateKey = generateDateKey(item.date, date);
        if (!grouped[dateKey]) {
            grouped[dateKey] = 0;
        }
        grouped[dateKey] += item.demand_kWh;
    });

    return Object.entries(grouped).map(([key, demand]) => ({ date: key, demand: demand.toFixed(3) }));
};

// Helper function to generate date keys based on the period
const generateDateKey = (date, period) => {
    const d = new Date(date);
    if (period === 'daily') return d.toISOString().split('T')[0];
    if (period === 'weekly') return getWeekStartDate(d);
    if (period === 'monthly') return `${d.getFullYear()}-${d.getMonth() + 1}`;
};

// Function to compute the start of the week for a given date
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
