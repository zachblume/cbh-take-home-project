const crypto = require("crypto");
const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });
  it("Returns the literal '0' when given NULL or EMPTY STRING input", () => {
    // Test null
    let input = null;
    let trivialKey = deterministicPartitionKey(input);
    expect(trivialKey).toBe("0");

    // Test empty string
    input = "";
    trivialKey = deterministicPartitionKey(input);
    expect(trivialKey).toBe("0");
  });
  it("Returns an identical key when given a object with the key partitionKey set to a random alphanumeric string (fuzzy test)", () => {
    // Variables named first because we're going to reassign in loop
    let arbitraryInput, input, trivialKey;
    // Loop a hundred times
    for (let i = 0; i < 100; i++) {
      // Create an arbitrary key
      arbitraryInput = Math.random().toString(36).substring(2, 7)

      // Mock that into the accepted object
      input = { partitionKey: arbitraryInput }

      // Pass it
      trivialKey = deterministicPartitionKey(input);

      // Test that we get back the same arbitraryInput
      expect(trivialKey).toBe(arbitraryInput);
    }
  });
  it("Returned a hashed key when given a really long partitionKey inside an object (fuzzy test, singleton)", () => {
    // Create an arbitrary key
    let arbitraryInput = Math.random().toString(36).substring(2, 7)
    let reallyLongKey = arbitraryInput.repeat(100)

    // Mock that into the accepted object
    let input = { partitionKey: reallyLongKey }

    // Pass it
    let trivialKey = deterministicPartitionKey(input);

    // Test that we get back a hashed version
    let reallyLongKeyAfterHashing = crypto.createHash("sha3-512").update(reallyLongKey).digest("hex");
    expect(trivialKey).toBe(reallyLongKeyAfterHashing);
  });
  it("Returns a string of length 128 when given long input, no matter how long", () => {
    // Create an arbitrary key
    let arbitraryInput = Math.random().toString(36).substring(2, 7)
    let reallyLongKey = arbitraryInput.repeat(100)
    let reallyIncrediblyLongKey = arbitraryInput.repeat(99999)
    
    // Pass bare
    expect(deterministicPartitionKey(reallyLongKey).length).toBe(128);
    expect(deterministicPartitionKey(reallyIncrediblyLongKey).length).toBe(128);
    
    // Pass in the object oriented input syntax
    expect(deterministicPartitionKey({ partitionKey: reallyLongKey }).length).toBe(128);
    expect(deterministicPartitionKey({ partitionKey: reallyIncrediblyLongKey}).length).toBe(128);
  });
  it("Accepts several types of javascript objects as keyed inputs without throwing errors", () => {
    let objectInput = { a: 'b', c: 'd' }
    let arrayInput = ['a', 1, '5', 'hello world']
    let mapInput = new Map;
    mapInput.set('a', 1)
    mapInput.set(1, '5')
    mapInput.set("hello","world")
    expect(deterministicPartitionKey(objectInput)).toBe(
      crypto.createHash("sha3-512").update(JSON.stringify(objectInput)).digest("hex")
    );
    expect(deterministicPartitionKey(arrayInput)).toBe(
      crypto.createHash("sha3-512").update(JSON.stringify(arrayInput)).digest("hex")
    );
    expect(deterministicPartitionKey(mapInput)).toBe(
      crypto.createHash("sha3-512").update(JSON.stringify(mapInput)).digest("hex")
    );
  });
});
