import express from 'express';
import {create, findAll, deleteFile, findById, download, update} from '../controllers/PictureController.js';
import upload from '../config/multer.js';

const router = express.Router();

router.post("/", upload.single("file"), create);
router.get("/", findAll);
router.put("/:id", upload.single("file"), update);
router.get("/download/:fileName", download);
router.get("/:id", findById);
router.delete("/:id", deleteFile);

export default router;