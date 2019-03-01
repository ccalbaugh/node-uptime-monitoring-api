const repl = require("repl");

repl.start({
  prompt: ">",
  eval: str => {
    console.log(`At the evaluation state: ${str}`);

    if (str.includes("fizz")) {
      console.log("buzz");
    }
  }
});
