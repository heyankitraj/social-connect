import multer from "multer";
import path from "path"

const randomString = () => {
  const String = "abcdefghijklmnopqrstuvwxyz";
  let newString = "";
  for (let i = 0; i <= 10; i++) newString += String.charAt(Math.random() * 26);

  return newString;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + randomString() + "-" + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

export default upload;
