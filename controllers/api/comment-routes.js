const router=require('express').Router();
const {Comment}=require('../../models');
//middleware
const withAuth=require('../../utils/auth');

//Get a comment
router.get('/', (req,res)=>{
    Comment.findAll({})
        .then(dbComment=>res.json(dbComment))
        .catch(err=>{
            console.log(err);
            res.status(500).json(err);
        })
});

//Get a comment by id
router.get('/:id',(req,res)=>{
    Comment.findAll({
        where:{
            id:req.params.id
        }
    }) .then(dbComment=>res.json(dbComment))
       .catch(err=>{
           console.log(err);
           res.status(500).json(err);
       })
});

router.post('/', withAuth, (req,res)=>{
    if(req.session) {
        Comment.create({
            comment_text:req.body.comment_text,
            post_id:req.body.post_id,
            user_id:req.session.user_idm
        }).then(dbComment=>res.json(dbComment))
          .catch(err=>{
              console.log(err);
              res.status(400).json(err);
          })
    }
});

router.put('/:id',withAuth,(req,res)=>{
    Comment.update({
        comment_text:req.body.comment_text
    },{
        where:{
            id:req.params.id
        }
    }).then(dbComment=>{
        if(!dbComment) {
            res.status(404).json({message: 'No comment found with this id'});
            return;
        } res.json(dbComment);
    }).catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete('/:id',withAuth,(req,res)=>{
    Comment.destroy({
        where: {
            id:req.params.id
        }
    }).then(dbComment=>{
        if(!dbComment){
            res.status(404).json({message: 'No comment found with this id'});
            return;
        }
        res.json(dbComment);
    }).catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports=router;