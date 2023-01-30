const user = {
  name: "Femi",
  email: "femi@example.com",
  password: "123456",
  matchPassword: function (enteredPassword) {
    if (enteredPassword === this.password) {
      console.log("Successful");
    } else {
      console.log("Invalid password");
    }
  },
};

user.matchPassword("123456");
