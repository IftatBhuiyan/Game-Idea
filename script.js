$(document).ready(function () {
  $(".word-field, .wordoftheday").each(function (index) {
    var hintNumber = index + 1;
    var $hint = $(".hint" + hintNumber);
    var $answerLetter = $(".answer_letter" + hintNumber);

    var hoverTimeout;

    $(this).hover(function () {
      // This will be executed when the mouse enters the word field or wordoftheday
      if (!$(this).hasClass('correct')) {
        clearTimeout(hoverTimeout);
        $hint.show(300);
        $answerLetter.show(300);
      }
    }, function () {
      // This will be executed when the mouse leaves the word field or wordoftheday
      if (!$(this).hasClass('correct') && !$(this).hasClass('clicked')) {
        hoverTimeout = setTimeout(function () {
          $hint.hide(300);
          $answerLetter.hide(300);
        }, 200);
      }
    }).click(function () {
      // On click, remove 'clicked' class from all fields and hide their hints and answer letters
      if (!$(this).hasClass('correct')) {
        $('.clicked').removeClass('clicked').prev('.hint').hide(300);
        $('.answer_letter').hide(300);

        // Then add 'clicked' class to the clicked field and show its hint and answer letter
        $(this).addClass('clicked');
        $hint.show(300);
        $answerLetter.show(300);
      }
    });
  });

  // Hide the hint and remove 'clicked' class when clicking outside
  $(document).click(function (e) {
    if (!$(e.target).closest('.word-field, .answer_letter, .wordoftheday').length) {
      $('.clicked').removeClass('clicked').prev('.hint').hide(300);
      $('.answer_letter').hide(300);
    }
  });
});



let wordContainers = document.querySelectorAll('.word1, .word2, .word3, .word4, .word5');

wordContainers.forEach((wordContainer) => {
  let inputs = wordContainer.querySelectorAll('.input');
  let hintNumber = Array.from(wordContainers).indexOf(wordContainer) + 1;
  let $hint = $(".hint" + hintNumber);
  let $answerLetter = $(".answer_letter" + hintNumber);

  inputs.forEach((input, index) => {
    input.setAttribute('maxlength', '1');

    input.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^A-Za-z]/g, "").toUpperCase();

      if (index !== inputs.length - 1) {
        let nextInput = inputs[index + 1];
        if (input.value) {
          nextInput.focus();
          nextInput.setSelectionRange(0, 0);
        }
      } 
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === "Backspace") {
        if (index === inputs.length - 1) {
          // Clear the last field when backspace is pressed
          input.value = "";
          if (!input.value && index !== 0) {
            // Move back to the previous field if the current field is empty
            e.preventDefault();
            let prevInput = inputs[index - 1];
            prevInput.focus();
            prevInput.setSelectionRange(1, 1);
          }
        } else if (index !== 0 && !input.value) {
          // Prevent default behavior of backspace key to avoid
          // the input field being cleared when it's empty
          e.preventDefault();

          let prevInput = inputs[index - 1];
          prevInput.focus();
          prevInput.setSelectionRange(1, 1);
        }
      }
    });

    input.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^A-Za-z]/g, "").toUpperCase();

      let currentWord = '';
      inputs.forEach((input) => {
        currentWord += input.value;
      });
      //console.log('currentWord:', currentWord); // for debugging

      //console.log("Game Word:", consoleLogs);

      if (currentWord.length === inputs.length) {
        let hint = wordContainer.previousElementSibling.textContent.trim();
        //console.log('hint:', hint); // for debugging

        let answer = null;
        for (let i = 0; i < consoleLogs.length; i++) {
          let log = consoleLogs[i];
          let logKeys = Object.keys(log);
          let logValues = Object.values(log);

          if (logValues.includes(hint)) {
            let valueIndex = logValues.indexOf(hint);
            answer = logKeys[valueIndex];
            break;
          }
        }

        //console.log('answer:', answer); // for debugging
        if (currentWord === answer.toUpperCase()) {
          inputs.forEach((input) => {
            input.setAttribute('readonly', '');
            input.setAttribute('contenteditable', 'false');
          });
          wordContainer.classList.add('correct');
          wordContainer.classList.add('correct-answer');

          let index = Array.from(wordContainers).indexOf(wordContainer);
          let number = index + 1;
          let wordLetterElement = document.querySelector(`.wordoftheday.word-letter${number}`);

          //console.log('number:', number); // for debugging
          //console.log('wordLetterElement:', wordLetterElement); // for debugging

          if (wordLetterElement) {
            wordLetterElement.style.visibility = 'visible'; // change visibility to visible
          }

          $hint.hide(300);
          $answerLetter.hide(300);
        } else {
          wordContainer.classList.add('shake');
          setTimeout(() => {
            wordContainer.classList.remove('shake');
          }, 500);
        }
      }

    });
  });
});


let consoleLogs = [];
let randomWord;

function getRandomWord() {
  let randomIndex = Math.floor(Math.random() * wordBank.length);
  randomWord = wordBank[randomIndex];

  let hintDivs = document.querySelectorAll(".hint");
  // let answerDivs = document.querySelectorAll(".answer_letter");
  //console.log("Random Word:", randomWord);

  for (let i = 0; i < randomWord.length; i++) {
    let letter = randomWord[i];

    // Check if the letter exists in the updatedHints object
    if (updatedHints.hasOwnProperty(letter)) {
      let letterHints = updatedHints[letter];
      let hintIndex = Math.floor(Math.random() * letterHints.length);
      let selectedHint = letterHints[hintIndex];

      // Convert letterHints to an array and remove the selected hint
      letterHints = Object.values(letterHints);
      letterHints.splice(hintIndex, 1);
      updatedHints[letter] = letterHints;

      // Add the hint to the appropriate div
      if (hintDivs[i]) {
        hintDivs[i].innerText = selectedHint.hint;
        // answerDivs[i].innerText = selectedHint.hint;
      }

      //console.log("Hint:", selectedHint.hint);
      consoleLogs.push({ [selectedHint.answer]: selectedHint.hint });

      //console.log("Answer:", selectedHint.answer);
    }
  }
  //console.log(updatedHints)

  return randomWord;
}


// Get all the wordoftheday and letter_box elements
const wordOfDayElements = document.querySelectorAll('.wordoftheday');
const letterBoxElements = document.querySelectorAll('.letter_box');

// Add hover effect to letter_box elements when hovering over the wordoftheday elements
wordOfDayElements.forEach((wordElement, index) => {
  wordElement.addEventListener('mouseover', () => {
    // Add a CSS class to the corresponding letter_box element
    letterBoxElements[index].classList.add('hovered');
  });

  wordElement.addEventListener('mouseout', () => {
    // Remove the CSS class from the corresponding letter_box element
    letterBoxElements[index].classList.remove('hovered');
  });
});

let lockOnPositions = [
  { letter_box: "box1", position: 139.5 },
  { letter_box: "box2", position: 69.5 },
  { letter_box: "box3", position: -0.5 },
  { letter_box: "box4", position: -70.5 },
  { letter_box: "box5", position: -140.5 }
];


 let finalPositionsForWordFields = [
  { word: "word1", finalPosition: null },
  { word: "word2", finalPosition: null },
  { word: "word3", finalPosition: null },
  { word: "word4", finalPosition: null },
  { word: "word5", finalPosition: null }
]; 


$(document).ready(function() {
  $(".word-field").draggable({
    containment: ".frame15",
    scroll: false,
    axis: "x",
    start: function() {
      $(this).addClass("active");
      $(this).css("cursor", "move");
      updateWordFieldPositionsBefore();
    },
    drag: function() {
      updateWordFieldPositionsAfter();
    },
    stop: function() {
      updateWordFieldPositionsAfter();
      $(this).removeClass("active");
      $(this).css("cursor", "");
      //console.log("Before Dragging and Dropping:", wordFieldPositionsBefore);
      //console.log("After Dragging and Dropping:", wordFieldPositionsAfter);
  
      if (wordFieldPositionsAfter[0]) {
        // Find the closest position in lockOnPositions
        var closest = findClosestPosition(wordFieldPositionsAfter[0].left, lockOnPositions);
      
        // Set the position of the dropped word-field to the closest position
        $(this).css({ top: '0px', left: closest.closestPosition });
      
        // Update the positions of word-field elements after setting the position
        updateWordFieldPositionsAfter();
      
        // Get the class name of the word (e.g., "word1")
        let word = this.classList[0];
      
        // Find the corresponding entry in finalPositionsForWordFields and update the finalPosition
        let wordEntry = finalPositionsForWordFields.find(entry => entry.word === word);
        if (wordEntry) {
          wordEntry.finalPosition = closest.closestPosition;
        }
        //console.log("Final positions for word fields:", finalPositionsForWordFields);
      }
      
    }
  });
  

  $(".wordoftheday").droppable({
    accept: ".word-field",
    tolerance: "intersect",
    drop: function(event, ui) {
      var droppedWordField = ui.draggable;
      var wordOfDayPosition = $(this).position();
      droppedWordField.css({
        top: '0px',  // force top to 0px
        left: wordOfDayPosition.left
      });
      droppedWordField.removeClass("active");
      updateWordFieldPositionsAfter();
    }    
  });

  var wordFieldPositionsBefore = [];
  var wordFieldPositionsAfter = [];

  function updateWordFieldPositionsBefore() {
    wordFieldPositionsBefore = [];
    $(".word-field.active").each(function() {
      var position = $(this).position();
      wordFieldPositionsBefore.push(position);
    });
  }

  function updateWordFieldPositionsAfter() {
    wordFieldPositionsAfter = [];
    $(".word-field.active").each(function() {
      var position = $(this).position();
      if (!position) {
        position = { left: -0.5 };
      }
      wordFieldPositionsAfter.push(position);
    });
}

  function findClosestPosition(currentPosition, positions) {
    var closestPosition = positions[0].position;
    var closestDistance = Math.abs(currentPosition - closestPosition);
    var closestIndex = 0;
  
    for (var i = 1; i < positions.length; i++) {
      var distance = Math.abs(currentPosition - positions[i].position);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPosition = positions[i].position;
        closestIndex = i;
      }
    }
  
    return {closestPosition, closestIndex};
  }
});

let submitBtn = document.getElementById('submit-btn');
//console.log(submitBtn);


document.querySelector('#submit-btn').addEventListener('click', function() {
  finalPositionsForWordFields.forEach((wordField, index) => {
    // Get the corresponding .word-field element
    let word = document.querySelector(`.${wordField.word}`);

    // Get the input corresponding to the finalPosition
    let input;
    // if (wordField.finalPosition !== null) {
      input = word.querySelector(`[data-pos="${wordField.finalPosition}"] .input`);
    //}

    let userInput = input ? input.value : "";
    //console.log(`User input for ${wordField.word}: ${userInput}`);

    // Assume that randomWord is an array where each element is a random word for corresponding word-field
    if (userInput.toUpperCase() === randomWord[index].toUpperCase()) {
      // If they match, change the color of the letter boxes to green
      changeInputColor("green");
    } else {
      // If they don't match, change the color of the letter boxes to red
      changeInputColor("red");
    }
  });
});

function changeInputColor(color) {
  //let wordElement = document.querySelector(`.${word}`); // get the corresponding word-field
  let inputs = document.querySelectorAll('.wordoftheday'); // get all inputs inside this word-field

  inputs.forEach(input => {
    input.style.border = `1px solid ${color}`;
  });
}