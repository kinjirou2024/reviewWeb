import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
    create, deletepost, getposts,
    updatepost, getallposts, getallpostsbyuserid
} from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getposts', getposts)
router.get('/getallposts', getallposts)
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost)
router.put('/updatepost/:postId/:userId', verifyToken, updatepost)
router.get('/user/:userId', getallpostsbyuserid)

export default router;