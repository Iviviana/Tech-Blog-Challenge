const router=require('express').Router();
const sequelize=require('sequelize');
const { USE } = require('sequelize/dist/lib/index-hints');
const {User,Comment, Post}=require('../../models');
const withAuth=require('../../utils/auth');

router.get('/',(req,res)=>{
    User.findAll({
        attributes:{exclude:['[password]']}
    }).then(dbUser=>res.json(dbUser))
    .catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/id:',(req,res)=>{
    User.findOne({
        attributes:{exclude:['password']},
        where:{
            id:req.params.id
        },
        include:[{
            model: Post,
            attributes:['id','titiel','content','created_at']
        },{
            model:Comment,
            attributes:['id','cooment_text','created_at'],
            include:{
                model:Post,
                attributes:['title']
            }
        },{
            model:Post,
            attributes:['title']
        }]
    }).then(dbUser=>{
        if(!dbUser) {
            res.status(404).json({message:'No user found'});
            return;
        } res.json(dbUser);
    }).catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/',(req,res)=>{
    User.create({
        username:req.body.username,
        password:req.body.password
    }).then(dbUser=>{
        req.session.save(()=>{
            req.session.user_id=dbUser.id;
            req.session.username=dbUser.username;
            req.session.loggedIn=true;

            res.json(dbUser);
        });
    }).catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/login',(req,res)=>{
    User.findOne({
        where:{
            username:req.body.username
        }
    }).then(dbUser=>{
        if(!dbUser) {
            res.status(400).json({message:'No user exists with that username'});
            return;
        }
        const validatePW=dbUser.checkPassword(req.body.password);

        if(!validatePW) {
            res.status(400).json({message:'Your password was incorrect'});
            return;
        }
        req.session.save(()=>{
            req.session.user_id=dbUser.id;
            req.session.username=dbUser.username;
            req.session.loggedIn=true;
            
            res.json({user:dbUser, message:'You are now logged in, Welcome Back!'});
        });
    }).catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/logout',(req,res)=>{
    if(req.session.loggedIn){
        req.session.destroy(()=>{
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

router.put('/:id',(req,res)=>{
    User.update(req.body, {
        individualHooks:true,
        where:{
            id:req.params.id
        }
    }).then(dbUser=>{
        if(!dbUser[0]){
            res.status(404).json({message:'No user exists with this ID'});
            return;
        } res.json(dbUser);
    }).catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete('/:id',(req,res)=>{
    User.destroy({
        where:{
            id:req.params.id
        }
    }).then(dbUser=>{
        if(!dbUser){
            res.status(404).json({message:'No user exists with this id'});
            return;
        } res.json(dbUser);
    }).catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports=router;

