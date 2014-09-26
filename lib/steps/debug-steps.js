module.exports = function apiSteps() {
    this.Then('DEBUG I print the request body', function(done) {
        console.log(this.req && this.req.json);
        done();
    });

    this.Then('DEBUG I print the response body', function(done) {
        console.log(this.res && this.res.body);
        done();
    });

    this.Then(/^DEBUG I print the (bso|set)$/, function(collection, done) {
        console.log(this[collection]);
        done();
    });
};
