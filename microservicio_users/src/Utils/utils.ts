function verifyQuery(query: string): string;
function verifyQuery(query: undefined): undefined;
function verifyQuery(query: string | undefined): string | undefined {
  if (query === undefined) throw new Error("Undefined query");
  if (query.length === 0) throw new Error("Empty query");
  return query;
}

export { verifyQuery };
