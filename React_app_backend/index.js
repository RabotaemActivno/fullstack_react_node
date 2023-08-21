import express from "express";
import mongoose from "mongoose";
import { registerValidation, loginValidation, postCreateVAlidation } from "./validations.js";
import {UserController, PostController} from './controllers/index.js'
import multer from "multer";
import checkAuth from "./utils/checkAuth.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";
import cors from 'cors'

const uri =
  "mongodb+srv://admin:wwwwwwww@cluster0.wrqjghc.mongodb.net/blog?retryWrites=true&w=majority";

mongoose
  .connect(uri)
  .then(() => console.log("normalno"))
  .catch((err) => console.log("ebano vishlo", err));

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({storage})



app.use(express.json());
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post("/auth/login",loginValidation,handleValidationErrors ,UserController.login )
app.post("/auth/register",registerValidation,handleValidationErrors,UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res)=> {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
})

app.get('/tags', PostController.getlastTags)
app.get('/posts', PostController.getAll)
app.get('posts/tags', PostController.getlastTags)
app.get('/posts/:id', PostController.getOne)
app.post('/posts',checkAuth,postCreateVAlidation ,handleValidationErrors,PostController.create)
app.delete('/posts/:id', checkAuth ,PostController.remove)
app.patch('/posts/:id',checkAuth,postCreateVAlidation,handleValidationErrors ,PostController.update)




app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log(`server OK, click http://localhost:4444/`);
});
