function convertToExpression(array) {
  const [operator, ...operands] = array;

  let exp = operands.map((operand) => {
    if (Array.isArray(operand)) {
      return `(${convertToExpression(operand)})`;
    }
    return operand;
  });

  return `${exp.join(`${operator}`)}`;

  //return operator.concat(exp);
  //return exp.concat(operator)

  // console.log(res);
}

const inpSeq = [
  "OR",
  ["<", "a", "b"],
  ["AND", ["===", "c", "d"], ["!==", "e", "f"]],
];
const resultSequence = convertToExpression(inpSeq);

console.log(resultSequence);
