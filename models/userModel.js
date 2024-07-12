import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

//? Database configuration and connection
const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect();

//? Fetch all users from the database
export async function getUsers() {
  try {
    const usersData = await db.query("SELECT * FROM users ORDER BY id");
    return usersData.rows;
  } catch (err) {
    console.log(err.message);
  }
}

//? Create a new user and return the new user's ID
export async function createUser(name, color) {
  try {
    const data = await db.query(
      "INSERT INTO users (name, color) VALUES ($1, $2) RETURNING id",
      [name, color]
    );
    return data.rows[0].id;
  } catch (err) {
    console.log(err.message);
    return 1;
  }
}

//? Fetch the current user's name
export async function getCurrentUser(currentUserId) {
  const data = await db.query("SELECT name FROM users WHERE id = $1", [
    currentUserId,
  ]);
  return data.rows[0].name;
}

//? Fetch countries visited by the user
export async function getCountries(user_id) {
  const result = await db.query(
    "SELECT country_code FROM visited_countries WHERE user_id=$1",
    [user_id]
  );
  return result.rows.map((row) => row.country_code);
}

//? Get country code from country name
export async function getCountryCode(CountryName) {
  try {
    const countryData = await db.query(
      `SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'`,
      [CountryName.toLowerCase()]
    );
    return countryData.rows[0].country_code;
  } catch (err) {
    throw new Error("Incorrect country name try again");
  }
}

//? Insert a new country into visited countries
export async function insertNewCountry(countryCode, user_id) {
  try {
    await db.query(
      `INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)`,
      [countryCode, user_id]
    );
  } catch (err) {
    throw new Error("Country is already present");
  }
}
