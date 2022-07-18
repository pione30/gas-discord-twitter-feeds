const greeter = (person: string): string => {
  return `Hello, ${person}!`;
};

function testGreeter(): void {
  const person = "Person";
  Logger.log(greeter(person));
}
