window.addEventListener("load", function OnWindowLoaded() {
  let signs = [
    "1",
    "2",
    "3",
    "+",
    "4",
    "5",
    "6",
    "-",
    "7",
    "8",
    "9",
    "/",
    "0",
    "=",
    "*",
    "c",
    "%",
    ".",
  ];

  let calc = document.getElementById("calc");

  var textArea = document.getElementById("inputVal");

  signs.forEach(function (sign) {
    let signElement = document.createElement("div");
    signElement.className = "btn";
    signElement.innerHTML = sign;
    calc.appendChild(signElement);
  });

  document.querySelectorAll("#calc-wrap .btn").forEach(function (button) {
    button.addEventListener("click", onButtonClick);
  });
  function stringText(str) {
    let massNum = [];
    let countN = 0,
      sum = "";
    for (let i = 0; i < str.length; i++) {
      if (
        str[i] === "+" ||
        str[i] === "-" ||
        str[i] === "*" ||
        str[i] === "/" ||
        str[i] === "%"
      ) {
        massNum[countN] = parseFloat(sum);
        countN++;
        sum = "";
      } else {
        sum += str[i];
      }
      if (i == str.length - 1) {
        massNum[countN] = parseFloat(sum);
      }
    }
    countN = 0;
    let massMark = [],
      massEnd = [];
    for (let i = 0; i < str.length; i++) {
      if (
        str[i] === "+" ||
        str[i] === "-" ||
        str[i] === "*" ||
        str[i] === "/" ||
        str[i] === "%"
      ) {
        massMark[count] = str[i];
        count++;
      }
    }
    count = 0;
    if (massMark.length == massNum.length) {
      for (let i = 0; i < str.length; i++) {
        massEnd.push(massMark[i]);
        massEnd.push(parseFloat(massNum[i]));
      }
    } else {
      for (let i = 0; i < massNum.length; i++) {
        massEnd.push(parseFloat(massNum[i]));
        if (i < massNum.length - 1) {
          massEnd.push(massMark[i]);
        }
      }
    }
    return massEnd;
  }
  function onButtonClick(e) {
    if (e.target.innerHTML === "c") {
      textArea.innerHTML = "0";
    } else if (e.target.innerHTML === "=") {
      textArea = document.getElementById("inputVal");
      let str = textArea.innerHTML;
      let mass = stringText(str);

      textArea.innerHTML = calculate(mass);
    } else if (textArea.innerHTML === "0") {
      if (e.target.innerHTML === ".") {
        textArea.innerHTML += e.target.innerHTML;
      } else {
        textArea.innerHTML = e.target.innerHTML;
      }
    } else {
      textArea.innerHTML += e.target.innerHTML;
    }
  }
  var count = 0;

  function calculate(calc) {
    var ops = [
        { "%": (a, b) => a % b },
        { "*": (a, b) => a * b, "/": (a, b) => a / b },
        { "+": (a, b) => a + b, "-": (a, b) => a - b },
      ],
      newCalc = [],
      currentOp;

    for (var i = 0; i < ops.length; i++) {
      for (var j = 0; j < calc.length; j++) {
        if (calc[0] == "-" && count == 0) {
          calc[1] *= -1;
          j++;
          count++;
        }

        if (ops[i][calc[j]]) {
          currentOp = ops[i][calc[j]];
        } else if (currentOp) {
          newCalc[newCalc.length - 1] = currentOp(
            parseFloat(newCalc[newCalc.length - 1]),
            parseFloat(calc[j]),
          );
          currentOp = null;
        } else {
          newCalc.push(calc[j]);
        }
      }
      calc = newCalc;
      newCalc = [];
    }

    if (calc.length > 1) {
      console.log("Error: unable to resolve calculation");
      return calc;
    } else {
      if (calc[0] % 1 > 0 || calc[0] < 0) {
        return calc[0].toFixed(1);
      } else {
        return calc[0];
      }
    }
  }
});
