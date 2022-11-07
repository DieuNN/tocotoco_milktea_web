import {Application, Response, Request} from 'express';
import multer from "multer";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {addProductCategory} from "../postgre";

export function productCategoryRoute(app: Application, upload: multer.Multer) {
    // const upload = multer({
    //     storage : multer.memoryStorage()
    // })
    app.get('/category', (req: Request, res: Response) => {
        // if (req.session.userid === 'admin') {
        //     res.render('product_category')
        // } else {
        //     res.redirect('/login')
        // }
        res.render('product_category')
    })

    app.post("/add_category", upload.single('image'), (req: Request, res: Response) => {
        if (!req.file) {
            res.end("File required")
        }
        const {name, description} = req.body
        const storage = getStorage()
        const metadata = {
            contentType: "image/jpeg"
        }
        const fileName = encodeURIComponent(req!.file!.originalname)
        const storageRef = ref(storage, "/images" + fileName)
        const uploadTask = uploadBytesResumable(storageRef, req!.file!.buffer, metadata)
        uploadTask.on("state_changed", (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        }, (error) => {
            console.log(error)
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then(r => {
                // console.log(r)
                addProductCategory({
                    id: null,
                    name: name,
                    description: description,
                    displayImage: r,
                    createAt: null,
                    modifiedAt: null
                }).then(r1 => {
                    res.redirect("/category")
                }).catch(e => {
                    res.end(e.toString())
                })
            })
        })
    })
}
