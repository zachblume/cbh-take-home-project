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
  // Destructure it if it's in object format
  if (input.partitionKey) output = input.partitionKey;

  // Stringify all !string to string and hash it
  else output = hashIt(JSON.stringify(input));

  // Stringify all !string to string
  if (typeof output !== "string") output = JSON.stringify(output);

  // Hash it if its too long
  if (output.length > MAX_PARTITION_KEY_LENGTH) output = hashIt(output);

  // And return it
  return output;
};

const hashIt = (input) => crypto.createHash("sha3-512").update(input).digest("hex");