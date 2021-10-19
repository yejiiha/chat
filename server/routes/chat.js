const express = require('express');
const router = express.Router();
const { Chat } = require("../models/Chat");
const { auth } = require("../middleware/auth");
const multer = require('multer')
const fs = require("fs")
//=================================
//             Chat
//=================================

router.get("/getChats", (req, res) => {
    Chat.find()
        .populate("sender")
        .exec((err,chats) => {
            if(err) return res.status(400).send(err);
            return res.status(200).send(chats);
        });
});

//파일 올리기
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb){
    cb(null, `${ Date.now()}_${file.originalname}`)
    //제목 형식
  }
})

var upload = multer({storage : storage}).single("file")


router.get("/uploadfiles", auth, (req, res) => {
    uploead(req, res, err => {
        if(err){
            return res.json({success: false, err})
        }
        return res.json({success:true, url:res.req.file.path})
    })
});

module.exports = router;