const express = require("express");
const router = express.Router(); // express router -> mini aplikacja do grupowania endpointów
const users = []; //tymczasowe przechowywanie danych

//rejestracja -> tworzenie nowego usera
router.post("/", (req, res) => {
  const { username, email, password } = req.body;
  const exists = users.find((u) => {
    return u.email === email;
  });

  if (!exists) {
    const newUser = {
      id: Date.now().toString(),
      username: username,
      email: email,
      password: password, //temporary!
      createdAt: Date.now(),
    };
    users.push(newUser);
    delete newUser.password;
    return res.status(201).json(newUser);
  } else {
    return res.status(400).json("User with that email already exists");
  }
});

router.get("/", (req, res) => {
  res.json(users);
});

//get dane uzytkownika -> logowanie?
router.get("/:id", (req, res) => {
  const id = req.params.id; // id nie przychodzi z posta (body) -> pochoddzi z params (dane z url)

  const found = users.find((u) => {
    return u.id === id;
  });

  if (!found) {
    return res.status(404).json("No such user found");
  } else {
    const resultUser = {
      id: found.id,
      username: found.username,
      email: found.email,
      createdAt: found.createdAt,
    };
    return res.status(200).json(resultUser); // 200 dla get -> 201 dla post
  }
});

//update dane uzytownika -> aktualizacja
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json("No such user found");
  } else {
    users[userIndex] = {
      ...users[userIndex],
      ...req.body,
    };
    delete users[userIndex].password;
    return res.status(200).json(users[userIndex]);
  }
});

//usuwanie dane uzytkowanika -> delete

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json("No such user found");
  } else {
    users.splice(userIndex, 1); // modyfikuje a nie usuwam
    return res.status(200).json("User deleted");
  }
});

module.exports = router; // eksportowanie router aby server mogl go zaimportowac
