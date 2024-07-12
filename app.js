import express from "express";
import bodyParser from "body-parser";
import {
  renderHome,
  handleAddCountry,
  changeUser,
  renderNewUserPage,
  createNewUser,
} from "./controllers/userController.js";

const app = express();
const port = 3000;

//? Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

//? Define routes and map to controller functions
app.get("/", renderHome);
app.post("/add", handleAddCountry);
app.post("/user", changeUser);
app.post("/addNewUser", renderNewUserPage);
app.post("/new", createNewUser);

//? Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
