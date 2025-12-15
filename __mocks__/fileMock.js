// When importing assets such as images in a module under test, Jest
// will return the string below instead of attempting to load the
// actual file.  This prevents errors from unknown file types and
// mirrors the recommended configuration from the Next.js testing
// documentation【995523870122251†L650-L664】.
module.exports = 'test-file-stub';