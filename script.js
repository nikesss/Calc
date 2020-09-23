localStorage.clear();
window.addEventListener("load", function OnWindowLoaded() {
  let signs = [
    "1",
    "2",
    "3",
    "+",
    "sin",
    "cos",
    "4",
    "5",
    "6",
    "-",
    "tg",
    "ctg",
    "7",
    "8",
    "9",
    "/",
    "Rad",

    ".",
    "0",
    "!",
    "*",
    "^",
    "%",
    "c",
    "=",
    "последние действия",
  ];

  let calc = document.getElementById("calc");

  var textArea = document.getElementById("inputVal");
  let massForStorage = [];
  signs.forEach(function (sign) {
    let signElement = document.createElement("div");
    signElement.className = "btn";
    signElement.innerHTML = sign;
    calc.appendChild(signElement);
  });

  document.querySelectorAll("#calc .btn").forEach(function (button) {
    button.addEventListener("click", onButtonClick);
  });
  function storage(calc, answer) {
    let stringForMassStorage = "";
    for (let i = 0; i < calc.length; i++) {
      stringForMassStorage += calc[i];
    }
    stringForMassStorage += "=";
    stringForMassStorage += answer;
    if (massForStorage.length == 3) {
      massForStorage.shift();
      massForStorage.push(stringForMassStorage);
    } else {
      massForStorage.push(stringForMassStorage);
    }
    localStorage.setItem("answers", massForStorage);
  }
  function stringText(str) {
    let massEnd = [];
    let countN = 0,
      sum = "";
    for (let i = 0; i < str.length; i++) {
      if (
        (str[i] === "s" && str[i + 1] === "i" && str[i + 2] === "n") ||
        (str[i] === "c" && str[i + 1] === "o" && str[i + 2] === "s") ||
        (str[i] === "c" && str[i + 1] === "t" && str[i + 2] === "g")
      ) {
        if (sum !== "") {
          massEnd.push(parseFloat(sum));
        }
        massEnd.push(str[i] + str[i + 1] + str[i + 2]);
        i = i + 2;
        sum = "";
      } else if (str[i] === "t" && str[i + 1] === "g") {
        if (sum !== "") {
          massEnd.push(parseFloat(sum));
        }
        massEnd.push(str[i] + str[i + 1]);
        i = i + 1;
        sum = "";
      } else if (
        str[i] === "+" ||
        str[i] === "-" ||
        str[i] === "*" ||
        str[i] === "/" ||
        str[i] === "%" ||
        str[i] === "!" ||
        str[i] === "^"
      ) {
        if (sum == "") {
          massEnd.push(str[i]);
        } else {
          massEnd.push(parseFloat(sum));
          massEnd.push(str[i]);
        }

        sum = "";
      } else {
        sum += str[i];
      }
      if (i == str.length - 1 && sum != "") {
        massEnd.push(parseFloat(sum));
      }
    }

    return massEnd;
  }
  function onButtonClick(e) {
    if (e.target.innerHTML === "c") {
      textArea.innerHTML = "0";
    } else if (
      e.currentTarget.innerHTML === "Rad" ||
      e.currentTarget.innerHTML === "Deg"
    ) {
      console.log(e);
      if (e.target.innerHTML === "Rad") {
        e.target.innerHTML = "Deg";
        e.toElement.id = "rad";
      } else {
        e.target.innerHTML = "Rad";
        e.toElement.id = "deg";
      }
    } else if (e.target.innerHTML === "последние действия") {
      let textAnswer = document.getElementById("outAnswers");
      textAnswer.innerHTML = "";
      if (localStorage.getItem("answers")) {
        massForStorage = localStorage.getItem("answers").split(",");
        for (let i = 0; i < 3; i++) {
          if (massForStorage[i])
            textAnswer.innerHTML += massForStorage[i] + "\n";
        }
      } else {
        alert("Действий не проводилось");
      }
    } else if (e.target.innerHTML === "=") {
      textArea = document.getElementById("inputVal");
      let str = textArea.innerHTML;
      let mass = stringText(str);
      let radOrDeg;
      if (document.getElementById("rad")) {
        radOrDeg = true;
      } else {
        radOrDeg = false;
      }
      textArea.innerHTML = calculate(mass, radOrDeg);
      storage(mass, textArea.innerHTML);
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

  function factorial(n) {
    return n != 1 ? n * factorial(n - 1) : 1;
  }
  function calculate(calc, radOrDeg) {
    var ops = [
        { "!": (a) => factorial(a) },
        { "^": (a, b) => Math.pow(a, b) },
        {
          sin: (a) => (radOrDeg ? Math.sin(a) : Math.sin((a * Math.PI) / 180)),
          cos: (a) => (radOrDeg ? Math.cos(a) : Math.cos((a * Math.PI) / 180)),
          tg: (a) => (radOrDeg ? Math.tan(a) : Math.tan((a * Math.PI) / 180)),
          ctg: (a) =>
            radOrDeg ? Math.tanh(a) : Math.tanh((a * Math.PI) / 180),
        },
        { "%": (a, b) => a % b },
        {
          "*": (a, b) => a * b,
          "/": (a, b) => (b != 0 ? a / b : alert("Деление на ноль")),
        },
        { "+": (a, b) => a + b, "-": (a, b) => a - b },
      ],
      newCalc = [],
      currentOp,
      currentOp2,
      currentOp3;
    var count = 0;
    if (calc[0] == "-") {
      calc[1] *= -1;
      calc.shift();
    } else if (calc[0] == "+") {
      calc[1] *= 1;
      calc.shift();
    }
    for (var i = 0; i < ops.length; i++) {
      for (var j = 0; j < calc.length; j++) {
        if (ops[i][calc[j + 1]] && ops[i]["!"]) {
          currentOp3 = ops[i][calc[j + 1]];
        } else if (currentOp3) {
          newCalc[newCalc.length] = currentOp3(parseFloat(calc[j - 1]));
          currentOp3 = null;
        } else if (
          ops[i][calc[j]] &&
          (ops[i].sin || ops[i].cos || ops[i].tg || ops[i].ctg)
        ) {
          if (calc[j + 1]) {
            currentOp2 = ops[i][calc[j]];
          } else {
            alert("Неверный ввод");
          }
        } else if (currentOp2) {
          newCalc[newCalc.length] = currentOp2(parseFloat(calc[j]));
          currentOp2 = null;
        } else if (ops[i][calc[j]]) {
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

    if (calc.length > 1 || calc.length < 0) {
      alert("Проверте вводимые данные");
      return calc;
    } else {
      if (parseFloat(calc[0])) {
        return parseFloat(calc[0].toFixed(3));
      } else {
        return 0;
      }
    }
  }
});
