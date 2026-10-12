const LESSONS_PYTHON = {
  "py1": {
    "id": "py1",
    "track": "python",
    "title": "Hello Python",
    "steps": [
      {
        "title": "What is Python?",
        "teach": "Python is a text coding language used in schools, games tools, AI, and websites. You type instructions line by line.",
        "type": "mcq",
        "prompt": "Python code is usually…",
        "choices": [
          "Typed as text",
          "Only painted with a brush",
          "Only snapped as Scratch blocks",
          "Only spoken in pirate"
        ],
        "answer": 0,
        "why": "Python is text-based.",
        "hint": "print(\"Hi\") is text."
      },
      {
        "title": "print",
        "teach": "print(\"Hi\") shows Hi on the screen/output.",
        "type": "mcq",
        "prompt": "Which line shows Hi?",
        "choices": [
          "print(\"Hi\")",
          "shout Hi",
          "explode(\"Hi\")",
          "Part.Hi"
        ],
        "answer": 0,
        "why": "print writes to output.",
        "hint": "Remember the parentheses."
      },
      {
        "title": "Quotes",
        "teach": "Text values (strings) use quotes: \"Alexa\" or 'Alexa'.",
        "type": "mcq",
        "prompt": "In print(\"Alexa\"), Alexa is a…",
        "choices": [
          "String (text)",
          "Integer only",
          "Button component",
          "Unity Scene"
        ],
        "answer": 0,
        "why": "Quotes mark text.",
        "hint": "Strings = text."
      },
      {
        "title": "Command",
        "teach": "The command that shows text is…",
        "type": "fill",
        "prompt": "Type it:",
        "answerText": "print",
        "accept": [
          "print"
        ],
        "why": "print displays output.",
        "hint": "p _ _ _ _"
      }
    ]
  },
  "py2": {
    "id": "py2",
    "track": "python",
    "title": "Variables",
    "steps": [
      {
        "title": "Variables store",
        "teach": "name = \"Alexa\" stores text in a box called name.",
        "type": "mcq",
        "prompt": "A variable is…",
        "choices": [
          "A named place to store a value",
          "A broken keyboard key",
          "A type of pizza only",
          "A Roblox material"
        ],
        "answer": 0,
        "why": "Variables store values.",
        "hint": "Labeled boxes."
      },
      {
        "title": "Use it",
        "teach": "After name = \"Alexa\", print(name) shows Alexa.",
        "type": "mcq",
        "prompt": "What does print(name) need first?",
        "choices": [
          "A variable name already set",
          "A Unity license",
          "A Hopscotch account",
          "A green flag block"
        ],
        "answer": 0,
        "why": "Define before use.",
        "hint": "Create the box first."
      },
      {
        "title": "Numbers",
        "teach": "score = 0 stores a number. You can later do score = score + 1.",
        "type": "mcq",
        "prompt": "score = 0 stores a…",
        "choices": [
          "Number",
          "Sprite costume",
          "HTML tag",
          "Phone Button"
        ],
        "answer": 0,
        "why": "Numbers don’t need quotes.",
        "hint": "0 is an int."
      },
      {
        "title": "Assign",
        "teach": "To store 5 in x you write: x = ___",
        "type": "fill",
        "prompt": "Type the number:",
        "answerText": "5",
        "accept": [
          "5"
        ],
        "why": "x = 5 assigns five.",
        "hint": "Digit five."
      }
    ]
  },
  "py3": {
    "id": "py3",
    "track": "python",
    "title": "If & Input",
    "steps": [
      {
        "title": "if decisions",
        "teach": "if score > 10: print(\"Win!\") runs the indented line only when the condition is true.",
        "type": "mcq",
        "prompt": "if is used for…",
        "choices": [
          "Decisions / conditions",
          "Drawing 3D Parts only",
          "Only CSS colors",
          "Deleting Python"
        ],
        "answer": 0,
        "why": "if branches your program.",
        "hint": "True → run block."
      },
      {
        "title": "Indentation",
        "teach": "Python uses indentation (spaces) to show which lines belong inside if/loops.",
        "type": "mcq",
        "prompt": "In Python, indenting under if means…",
        "choices": [
          "Those lines belong to the if",
          "The code is broken forever",
          "It becomes JavaScript",
          "It becomes a photo"
        ],
        "answer": 0,
        "why": "Indent = structure.",
        "hint": "Spaces matter!"
      },
      {
        "title": "input",
        "teach": "name = input(\"Your name? \") asks the player and stores what they type.",
        "type": "mcq",
        "prompt": "input() is for…",
        "choices": [
          "Reading what the user types",
          "Moving Roblox Parts",
          "Painting Unity skies",
          "Snapping Scratch blocks"
        ],
        "answer": 0,
        "why": "input gets user text.",
        "hint": "Ask → store."
      },
      {
        "title": "Tiny quiz program",
        "teach": "Put the flow in order:",
        "type": "order",
        "prompt": "Order:",
        "items": [
          "Ask for a number with input",
          "Convert/use it in a variable",
          "if check if it’s big enough",
          "print a message"
        ],
        "answerOrder": [
          0,
          1,
          2,
          3
        ],
        "why": "Ask → store → if → print.",
        "hint": "Ask first."
      }
    ]
  },
  "py4": {
    "id": "py4",
    "track": "python",
    "title": "Loops",
    "steps": [
      {
        "title": "for loops",
        "teach": "for i in range(3): print(i) repeats a few times with a counter.",
        "type": "mcq",
        "prompt": "for i in range(3) is a…",
        "choices": [
          "Loop",
          "Sprite",
          "Scene",
          "Button"
        ],
        "answer": 0,
        "why": "for repeats with a sequence.",
        "hint": "range makes numbers."
      },
      {
        "title": "while loops",
        "teach": "while energy > 0: keeps going until the condition becomes false — careful of infinite loops!",
        "type": "mcq",
        "prompt": "A while loop needs…",
        "choices": [
          "A condition that can become false",
          "A green Scratch flag",
          "A Unity cube",
          "An App Inventor Label"
        ],
        "answer": 0,
        "why": "Conditions should end sometime.",
        "hint": "Avoid forever-while bugs."
      },
      {
        "title": "First project idea",
        "teach": "Print a greeting, store a score, loop 5 cheers — that’s a real Python mini project!",
        "type": "mcq",
        "prompt": "A good first Python project includes…",
        "choices": [
          "print + a variable + a small loop",
          "Deleting the interpreter",
          "Only secret assembly",
          "Only HTML forms"
        ],
        "answer": 0,
        "why": "Small + working beats huge + broken.",
        "hint": "Tiny wins."
      },
      {
        "title": "range",
        "teach": "for i in range(___):  for three times use…",
        "type": "fill",
        "prompt": "Number:",
        "answerText": "3",
        "accept": [
          "3"
        ],
        "why": "range(3) → 0,1,2.",
        "hint": "Three."
      }
    ]
  }
};
