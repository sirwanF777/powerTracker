module.exports = (app) => {
    app.use((req, res) => {
        res.send({
            status: 404,
            code: `Not Founded.`,
            message: `Requested Resource Could Not Be Found.`
        });
    });
}