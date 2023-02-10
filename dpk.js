const crypto = require("crypto");

exports.deterministicPartitionKey = (input) => {
  // Rename trivial to default
  const DEFAULT_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;

  // At first set the solution to the default
  let output = DEFAULT_PARTITION_KEY;

  // There's no input at all, or it's zero or null or
  // otherwise falsy, skip to return default:
  if (!input) {
    return DEFAULT_PARTITION_KEY;
  }

  // There is input!
  if (input.partitionKey) {
    // Destructure it if it's in object format
    input = input.partitionKey;

    // Stringify all !string to string
    if (typeof input !== "string") input = JSON.stringify(input);

    output = input;
  } else {
    // Stringify all !string to string
    input = JSON.stringify(input);
    
    // Hash it
    output = hashIt(input)
  }

  if (output.length > MAX_PARTITION_KEY_LENGTH) output = hashIt(output);

  return output;
};

const hashIt = (input) => crypto.createHash("sha3-512").update(input).digest("hex");