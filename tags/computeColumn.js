const assert = require("assert");
module.exports = function (liquid) {
  liquid.registerTag("computeColumn", {
    parse: function (tagToken, remainTokens) {
      const args = tagToken.args.split(" ");
      assert(
        args.length === 2,
        `Syntax Error in 'computeColumn' - Valid syntax: computeColumn [table_name] [column_name]`
      );
      this.tableName = args[0];
      this.columnName = args[1];
      this.templates = [];
      const stream = liquid.parser.parseStream(remainTokens);
      stream
        .on("tag:endcomputeColumn", () => stream.stop())
        .on("template", (tpl) => this.templates.push(tpl))
        .on("end", () => {
          throw new Error(`tag ${tagToken.raw} not closed`);
        });
      stream.start();
    },
    render: async function (context) {
      const table = context.get(this.tableName);
      assert(Array.isArray(table), `${this.tableName} is not an array`);

      // storing originalContext to revert the variables changed other than table variable in the end
      const originalContext = context.getAll();

      for (let i = 0; i < table.length; i++) {
        const row = table[i];
        // creating a local temporary scope in context for row, so self keyword can refer to row
        context.push({ self: row, $$answer: undefined });
        try {
          await liquid.renderer.renderTemplates(this.templates, context);
          const finalResult = context.get("$$answer");
          table[i] = { ...row, [this.columnName]: finalResult };
        } catch (err) {
          throw err;
        } finally {
          context.pop();

          // Reset context to original state after each iteration for all variables other than table variable
          Object.keys(originalContext).forEach((key) => {
            if (key !== this.tableName) {
              context.set(key, originalContext[key]);
            }
          });
        }
      }

      context.set(this.tableName, table);
      return "";
    },
  });
};
