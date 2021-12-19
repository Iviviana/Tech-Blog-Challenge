const router=require('express').Router();
const sequelize=require('../config/connection');
const {Post, Comment, User}=require('../models');
//imprt middleware
const withAuth=require('../utils/auth');

//Get a post
router.get('/', async(req,res)=>{
    try {
        const dbPost=await Post.findAll({
            where:{
                user_id: req.session.user_id
            },
            attributes: [
                'id',
                'title',
                'content',
                'created_at'
            ],
            include:[{
                model: Comment,
                attributes:['id', 'comment_text', 'post_id','user_id','created_at'],
                include: {
                    model:User,
                    attributes:['username']
                }
            },{
                model:User,
                attributes:['username']
            }]
        });
        const posts=dbPost.map((post)=>post.get({plain:true}));
        res.render('dashboard',{
            posts,
            loggedIn: req.session.loggedIn
        });
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/edit/:id',withAuth,(req,res)=>{
    Post.findOne({
        where:{
            id:req.params.id
        },
        attributes: [
            'id',
            'title',
            'content',
            'created_at'
        ],
        include: [{
            model: User,
            attributes:['username']
        },{
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
                model: User,
                attributes: ['username']
            }
        }]
    }).then(dbPost=> {
        if(!dbPost) {
            res.status(404).json({ message: 'No posts found'});
            return;
        }
        const posts=dbPost.get({plain: true});
        res.render('edit-post', {post, loggedIn: true});
    }).catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
    
});

router.get('/new',(req,res)=>{
    res.render('new-post');
});

module.exports=router;