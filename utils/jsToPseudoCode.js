const jsToPseudoCode = (jsCode) => {
   let pseudoCode = bracketIndent(jsCode);
   pseudoCode = convert(pseudoCode);
   pseudoCode = simpleConversions(pseudoCode);
   pseudoCode = makePseudoArray(pseudoCode);
   return pseudoCode;
};

export default jsToPseudoCode;

const simpleConversions = (code) => {
   return code
      .replace(/var /g, '')
      .replace(/ != /g, ' ≠ ')
      .replace(/ >= /g, ' ≥ ')
      .replace(/ <= /g, ' ≤ ')
      .replace(/ === /g, ' = ')
      .replace(/ == /g, ' = ')
      .replace(/ % /g, ' MOD ')
      .replace(/ !/g, ' NOT')
      .replace(/ &&/g, ' AND')
      .replace(/ [|][|]/g, ' OR')
      .replace(/;/g, '')
      .replace(/if /g, 'IF')
      .replace(/else /g, 'ELSE')
      .replace(/else if /g, 'ELSE IF')
      .replace(/function/g, 'PROCEDURE');
};

const bracketIndent = (code) => {
   return code
      .split('\n')
      .map((line, i) => {
         if (line.includes(') {')) {
            let codeStart = line.lastIndexOf('  ');
            codeStart = codeStart === -1 ? 0 : codeStart + 2;
            let indent = line.substring(0, codeStart);

            line = line.replace(/[)] {/g, ') \n' + indent + '{');
            return line;
         } else {
            return line;
         }
      })
      .join('\n');
};

const invertConditions = (conditions) => {
   //uses De Morgan's Law to invert the conditions
   return conditions
      .replace(/ == /g, '≠')
      .replace(/ === /g, '≠')
      .replace(/ < /g, ' ≥ ')
      .replace(/ > /g, ' ≤ ')
      .replace(/ >= /g, ' < ')
      .replace(/ <= /g, ' > ')
      .replace(/ != /g, ' = ')
      .replace(/ !== /g, ' = ')
      .replace(/ % /g, ' MOD ')
      .replace(/ !/g, '')
      .replace(/ &&/g, ' OR')
      .replace(/ [|][|]/g, ' AND');
};

const makePseudoArray = (code) => {
   let newCodeString = code;

   while (
      newCodeString.indexOf('.getElem') >= 0
      /*newCodeString.indexOf('.setElem') >= 0 ||
      newCodeString.indexOf('.INSERT') >= 0 ||
      newCodeString.indexOf('.APPEND') >= 0 ||
      newCodeString.indexOf('.REMOVE') >= 0 ||
      newCodeString.indexOf('.LENGTH') >= 0 */
   ) {
      if (newCodeString.indexOf('.getElem') >= 0) {
         let getStart = newCodeString.indexOf('.getElem(');
         let getOpeningParenthesis = newCodeString.indexOf('(', getStart);
         let getClosingParenthesis = newCodeString.indexOf(')', getOpeningParenthesis);
         let val = newCodeString.substring(getOpeningParenthesis + 1, getClosingParenthesis);
         newCodeString = newCodeString.replace(
            newCodeString.substring(getStart, getClosingParenthesis + 1),
            '[' + val + ']'
         );
      }
   }
   return newCodeString;
};

const convert = (code) => {
   //switches the assignment operator so the inverted conditions work
   let newCode = code.replace(/ = /g, ' ← ');
   return newCode
      .split('\n')
      .map((line) => {
         if (line.includes('while')) {
            let whileStart = line.indexOf('while');
            let conditions = line.substring(whileStart + 5, line.length - 1);
            let indent = line.substring(0, whileStart);
            console.log(conditions);
            conditions = invertConditions(conditions);
            console.log(conditions);
            return indent + 'REPEAT UNTIL' + conditions;
         } else if (line.includes('for')) {
            let forStart = line.indexOf('for');
            let forLine = line.substring(forStart, line.indexOf(')', forStart));
            let indent = line.substring(0, forStart);

            let count = forLine.substring(
               forLine.indexOf('<') + 2,
               forLine.indexOf(';', forLine.indexOf('<'))
            );
            count = simpleCoversions(count);
            return indent + 'REPEAT ' + count + ' TIMES ';
         } else if (line.includes('return')) {
            return line.replace('return ', 'RETURN(').replace(';', ')');
         } else if (line.includes('new PseudoArray(')) {
            return line.replace('new PseudoArray(', '').replace(');', '');
         } else {
            return line;
         }
      })
      .join('\n');
};
