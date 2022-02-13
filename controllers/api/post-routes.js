const router=require('express').Router();
const {Post, User, Comment}=require('../../models');
const sequelize=require('../../config/connection');
const withAuth=require('../../utils/auth');
const { findAll } = require('../../models/User');

router.get('/',(req,res)=>{
    Post.findAll({
        attributes:['id','title','content','created_at'],
        order:[
            ['created_at','DESC']
        ],
        include:[{
            model:User,
            attributes:['username']
        },
    {
        model: Comment,
        attributes:['id','comment_text','post_id','user_id','created_at'],
        include:{
            model:User,
            attributes:['username']
        }
    }]
    }).then(dbPost=>res.json(dbPost.reverse()))
    .catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/:id',(req,res)=>{
    Post.findOne({
        where:{
            id:req.params.id
        }, 
        attributes:['id','content','title','created_at'],
        include:[{
            model:User,
            attributes:['username']
        },{
            model:Comment,
            attributes:['id','comment_text','post_id','created_at'],
            include:{
                model: User,
                attributes:['username']
            }
        }]
    }).then(dbPost=>{
        if(!dbPost) {
            res.status(404).json({message: 'No post was found with this id'});
            return;
        }
    }).catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/',withAuth,(req,res)=>{
    Post.create({
        title:req.body.title,
        content:req.body.content,
        user_id:req.session.user_id
    }).then(dbPost=>res.json(dbPost))
    .catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

router.put('/:id',withAuth,(req,res)=>{
    Post.update({
        title:req.body.title,
        content:req.body.content
    },{
        where:{
            id:req.params.id
        }
    }).then(dbPost=>{
        if(!dbPost){
            res.status(404).json({message:'No post was found witht his id'});
            return;
        }
        res.json(dbPost);
    }).catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete('/:id',withAuth,(req,res)=>{
    Post.destroy({
        where:{
            id:req.params.id
        }
    }).then(dbPost=>{
        if(!dbPost) {
            res.status(404).json({message:'No post was found with this id'});
            return;
        }
    }).catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports=router;