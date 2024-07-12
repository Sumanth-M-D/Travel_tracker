import {
  getUsers,
  createUser,
  getCurrentUser,
  getCountries,
  getCountryCode,
  insertNewCountry,
} from "../models/userModel.js";

let currentUserId = 1;

//? Render the home page with user and country information
export async function renderHome(req, res) {
  await render(res, currentUserId);
}

//? Handle adding a new country to the user's visited list
export async function handleAddCountry(req, res) {
  try {
    const newCountry = req.body.country.trim();
    const countryCode = await getCountryCode(newCountry);
    await insertNewCountry(countryCode, currentUserId);
    await render(res, currentUserId);
  } catch (err) {
    console.log(err.message);
    await render(res, currentUserId, err.message);
  }
}

//? Handle changing the current user
export async function changeUser(req, res) {
  currentUserId = req.body.user;
  await render(res, currentUserId);
}

//? Render the new user page
export function renderNewUserPage(req, res) {
  res.render("new.ejs");
}

//? Handle creating a new user
export async function createNewUser(req, res) {
  const { name, color } = req.body;
  currentUserId = await createUser(name, color);
  await render(res, currentUserId);
}

//? Render helper function to fetch data and render the view
async function render(res, currentUserId, error = null) {
  const users = await getUsers();
  const countries = await getCountries(currentUserId);
  const currentUser = await getCurrentUser(currentUserId);

  res.render("index.ejs", {
    countries,
    total: countries.length,
    users,
    color: "teal",
    currentUser,
    error,
  });
}
