const User = mongoose.model('customer', {
    email: String,
    password: String,
    id: { type: String, default: uuidv4 }
});

module.exports = {
    user,
}