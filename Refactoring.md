# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here
This function is a deterministic, i.e., a consistent hashing algorithm for (judging by its name) bucketing/partitioning database rows into sharded db nodes.

The first thing I did was write a number of automated tests, some fuzzy in nature (i.e., with randomly generated values of different lengths), as well as different kinds of Falsy input, and kind of strange object inputs like obj, array and map.

This convered the edge cases of some of the hard-to-read control flow in the original with nested IFs and all that, and to be honest I was glad I wrote them because while refactoring I made several mistakes before I got it right to emit the same control flow and outcomes based on these same edge cases.

Usually I tend to be a fan of C-style curly brackets for clear intent, but in this case the readability problems of the original code came from superfluous control flow notation. Instead I made the choice to compress the code as short as possible and omit some curly brackets, while adding a lot of comments.

(1) I moved the default edge case of null/falsy inputs to the beginning and return'd/ended the function, inspired by the way Golang is typically written.

(2) I refactored out the hashing function for readability with an arrow/lambda function.

(3) I compressed down each of the control paths of "Is there a precomputed legit partitionKey already passed?" versus "we're doing this from scratch" down to a single unbracketed IF/ELSE on line 16-22 for readability

(4) Hashing it if its too long is duplicative after it's already been hashed since the hash always produces 128 length character string, and the test is >256, however the performance hit of O(1) checking the length is fine to improve the readability of not nesting it inside the input.partitionKey IS DEFINED case.

That's all, I dare say! :)

