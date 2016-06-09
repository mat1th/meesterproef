var setRights = function(req, res, next) {
    var role = req.session.role;
    req.admin = false;
    req.editor = false;

    if (role === 'admin') {
        req.admin = true;
        req.editor = true;
    } else if (role === 'editor') {
        req.editor = true;
    }
    next();
};

module.exports = setRights;


// admin: (session.role === 'admin') ? true : false,