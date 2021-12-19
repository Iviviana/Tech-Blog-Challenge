const withAuth=(req,res,next)=>{
    if(!req.session.loggedIn) {
        res.redirect('/login');
    } else {
        next();
        //next is called if the user is authenticated
    }
};

module.exports=withAuth;
