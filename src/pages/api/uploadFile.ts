import path from 'path'
import multer from 'multer'

var fName = ''

// var upload = multer({ dest: "Upload_folder_name" })
// If you do not want to use diskStorage then uncomment it

var storage = multer.diskStorage({
    destination: function (req, file, callback) {

        // Uploads is the Upload_folder_name
        callback(null, "temp")
    },
    filename: function (req, file, callback) {
        fName = file.originalname
        callback(null, file.originalname)
    }
})

// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 1000 * 1000 * 1000;

var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, callback) {

        // Set the filetypes, it is optional
        var filetypes = /jpeg|jpg|png|webp|gif/;
        var mimetype = filetypes.test(file.mimetype);

        var extname = path.extname(file.originalname).toLowerCase()
        extname = filetypes.test(extname);

        if (mimetype && extname) {
            fName = file.originalname
            return callback(null, fName);
        }

        callback("Error: File upload only supports the " + "following filetypes - " + filetypes, null);
    }
    // mypic is the name of file attribute
}).single("image");

function uploadFile(req, res) {
    // Error MiddleWare for multer file upload, so if any
    // error occurs, the image would not be uploaded!
    upload(req, res, function(err) {
        if (err) {
            // ERROR occurred (here it can be occurred due
            // to uploading image of size greater than
            // 1MB or uploading different file type)
            res.send(err)
        }
        else {
            // SUCCESS, image successfully uploaded
            var url = `/chat?`

            var redirect = req.query.redirect ? req.query.redirect === 'true' : true
            
            var hasParent = req.query.hasParent
            if (!!hasParent) url = `/upload?sucess=true&`
            
            url += `filelocation=temp-storage&name=${fName}`
            
            var p = req.query.p
            if (!!p) url += `&prompt=${p}`

            var t = req.query.t
            if (!!t) url += `&type=${t}`

            var isBulk = req.query.isBulk
            if (!!isBulk) url += `&isBulk=${isBulk}`

            if (!redirect) {
                res.json({status: 'uploaded', name: fName, filelocation: 'temp-storage'})
                return 
            }
            
            res.redirect(url)
        }
    })
}

export default uploadFile