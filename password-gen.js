const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let chars_lowercase = "abcdefghijklmnopqrstuvwxyz";
let chars_uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let numbers = "1234567890";
let chars_special = "!@#$%^&*()_+~<>?";

const avail_option = [chars_lowercase, chars_uppercase, chars_special, numbers];

function password(passwordLength, passwordOption) {
  let genPass_dict = "";
  for (let i = 0; i < passwordOption.length; i++) {
    genPass_dict = genPass_dict + avail_option[passwordOption[i]];
  }

  let UserPass = "";
  for (let i = 0; i < passwordLength; i++) {
    var randomIndex = Math.floor(genPass_dict.length * Math.random());
    UserPass = UserPass + genPass_dict[randomIndex];
  }

  return UserPass;
}

function mainMenu() {
  console.clear();
  console.log("Welcome to Password Generator");

  rl.question("Please enter your password length requirement : ", (passLen) => {
    const passLength = Number(passLen);
    console.log("Your Password Length is : ", passLength);

    // Call the function to fill the option array
    fillOptionArray(passLength, []);
  });
}

function fillOptionArray(length, options) {
  if (options.length >= 4) {
    console.log("You have selected four options. Generating the password...");
    console.log("Your selected options:", options);

    // Call the password function here to generate the password
    const generatedPassword = password(length, options);
    console.log("Generated Password:", generatedPassword);

    rl.close(); // Close the interface after reading all input
    return;
  }

  rl.question(
    `${
      options.length + 1
    }. Enter the option (0 for lowercase, 1 for uppercase, 2 for special characters, 3 for numbers), or press Enter to finish: `,
    (option) => {
      if (option === "") {
        if (options.length === 0) {
          console.log("You must select at least one option.");
          fillOptionArray(length, options);
        } else {
          console.log("Your selected options:", options);

          // Call the password function here to generate the password
          const generatedPassword = password(length, options);
          console.log("Generated Password:", generatedPassword);

          rl.close(); // Close the interface after reading all input
        }
      } else {
        const optionNumber = Number(option);
        if (
          Number.isInteger(optionNumber) &&
          optionNumber >= 0 &&
          optionNumber <= 3
        ) {
          if (!options.includes(optionNumber)) {
            options.push(optionNumber);
          } else {
            console.log(
              "Option already selected. Please choose a different option."
            );
          }
          fillOptionArray(length, options);
        } else {
          console.log("Invalid option. Please enter a valid option number.");
          fillOptionArray(length, options);
        }
      }
    }
  );
}

mainMenu();
