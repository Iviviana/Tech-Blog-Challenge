const router=require('express').Router();
const userRoutes=require('./user-routes');
const postRoutes=require('./post-routes');
const commRoutes=require('./comment-routes');

router.use('/users',userRoutes);
router.use('/posts',postRoutes);
router.use('/comments',commRoutes);

module.exports=router;