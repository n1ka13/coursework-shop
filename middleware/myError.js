class MyError extends Error {
constructor(message, status) {
super(message);
this.status = status || 500;
this.name = 'MyError';}
}

module.exports = MyError;