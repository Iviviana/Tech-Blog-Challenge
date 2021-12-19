const router=require('express').Router();
const sequelize=require('../config/connection');
const {Post, User, Comment}=require('../models');

//Get middleware
const withAuth=require('../utils/auth');

//Get post
router.get('/', async(req,res)=>{
    try {
        const dbPost=await Post.findAll({
            include: [{
                model: Comment,
                attributes: [
                    'id',
                    'title',
                    'content',
                    'created_at'
                ],
                include:{
                    model: User,
                    attributes:['username']
                }
            }]
        });

        const posts=dbPost.map((post)=> post.get({plain:true}));

        res.render('homepage', {
            post,
            loggedIn: req.session.loggedIn,
        });
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/login',(req,res)=>{
    if(req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

router.get('/signup',(req,res)=>{
    res.render('signup');
});

router.get('/post/:id',(req,res)=>{
    Post.findOne({
        where:{
            id:req.params.id
        },
        attributes:[
            'id',
            'content',
            'title',
            'created_at'
        ],
        include: [{
            model: Comment,
            attributes:['id','comment_text','post_id','created_at'],
            include:{
                model: User,
                attributes:['username']
            }
        },{
            model: User,
            attributes:['username']
        }]
    })
}).then(dbPost=>{
    if(!dbPost) {
        res.status(404).json({message: 'No post found'});
        return;
    } 
    const post=dbPost.get({plain: true});
    console.log(post);
    res.render('single-post',{post, loggedIn: req.session.loggedIn});
}).catch(err=>{
    console.log(err);
    res.status(500).json(err);
});

router.get('/posts-comments', (req,res)=>{
    Post.findOne({
        where:{
            id: req.params.id
        },
        attributes:[
            'id',
            'content',
            'title',
            'created_at'
        ],
        include: [{
            model: Comment,
            attributes:['id','comment_text','post_id','created_at'],
            include:{
                model: User,
                attributes:['username']
            }
        },{
            model: User,
            attributes:['username']
        }]
    }).then(dbPost=>{
        if(!dbPost) {
            res.status(404).json({message: 'No post was found'});
            return;
        }
        const post=dbPost.get({plain: true});

        res.render('posts-comments', {post, loggedIn:req.session.loggedIn});
    }).catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports=router;