# newline

Appends a newline (`\n`) to the input string if it does not already end with one.

This is useful for scenarios where multi-line string inputs are prevented and we rely on a single line definition for the liquid template.

## Example

```liquid
{{ "Hello" | newline }}World
```

Output:

```
Hello\nWorld
```
