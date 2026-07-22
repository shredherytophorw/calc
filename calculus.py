import tkinter
import math

# ---------------- Calculator Buttons ---------------- #

button_values = [
    ["AC", "+/-", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "√", "="],
    ["sin", "cos", "tan", ""]
]

right_symbols = ["÷", "×", "-", "+", "="]
top_symbols = ["AC", "+/-", "%"]

row_count = len(button_values)
column_count = len(button_values[0])

color_light_grey = "#D4D4D2"
color_black = "#1C1C1C"
color_dark_grey = "#505050"
color_orange = "#FF9500"
color_white = "white"

# ---------------- Variables ---------------- #

A = None
operator = None

# ---------------- Button Function ---------------- #

def button_clicked(value):
    global A, operator

    if label["text"] == "Error" and value != "AC":
        label["text"] = "0"

    if value in "0123456789":
        if label["text"] == "0":
            label["text"] = value
        else:
            label["text"] += value

    elif value == ".":
        if "." not in label["text"]:
            label["text"] += "."

    elif value == "AC":
        A = None
        operator = None
        label["text"] = "0"

    elif value == "+/-":
        if label["text"] != "0":
            if label["text"].startswith("-"):
                label["text"] = label["text"][1:]
            else:
                label["text"] = "-" + label["text"]

    elif value == "%":
        label["text"] = str(float(label["text"]) / 100)

    elif value == "√":
        number = float(label["text"])
        if number >= 0:
            result = math.sqrt(number)
            label["text"] = str(int(result)) if result.is_integer() else f"{result:.10g}"
        else:
            label["text"] = "Error"

    # ---------- Trigonometric Functions (Degrees) ---------- #

    elif value == "sin":
        angle = math.radians(float(label["text"]))
        result = math.sin(angle)
        label["text"] = f"{result:.10g}"

    elif value == "cos":
        angle = math.radians(float(label["text"]))
        result = math.cos(angle)
        label["text"] = f"{result:.10g}"

    elif value == "tan":
        angle = math.radians(float(label["text"]))
        result = math.tan(angle)
        label["text"] = f"{result:.10g}"

    # ---------- Operators ---------- #

    elif value in ["+", "-", "×", "÷"]:
        A = float(label["text"])
        operator = value
        label["text"] = "0"

    elif value == "=":
        if operator is None:
            return

        B = float(label["text"])

        try:
            if operator == "+":
                result = A + B
            elif operator == "-":
                result = A - B
            elif operator == "×":
                result = A * B
            elif operator == "÷":
                result = A / B

            label["text"] = str(int(result)) if result.is_integer() else f"{result:.10g}"

            A = None
            operator = None

        except ZeroDivisionError:
            label["text"] = "Error"
            A = None
            operator = None

# ---------------- Window ---------------- #

window = tkinter.Tk()
window.title("Scientific Calculator")
window.resizable(False, False)

frame = tkinter.Frame(window, bg=color_black)

label = tkinter.Label(
    frame,
    text="0",
    font=("Arial", 30),
    bg=color_black,
    fg=color_white,
    anchor="e",
    width=14,
    padx=10,
    pady=15
)

label.grid(row=0, column=0, columnspan=4, sticky="we")

# ---------------- Buttons ---------------- #

for row in range(row_count):
    for column in range(column_count):
        value = button_values[row][column]

        if value == "":
            continue

        button = tkinter.Button(
            frame,
            text=value,
            font=("Arial", 20),
            width=5,
            height=2,
            command=lambda value=value: button_clicked(value)
        )

        if value in top_symbols:
            button.config(bg=color_light_grey, fg=color_black)

        elif value in right_symbols:
            button.config(bg=color_orange, fg=color_white)

        else:
            button.config(bg=color_dark_grey, fg=color_white)

        button.grid(row=row + 1, column=column, padx=2, pady=2)

frame.pack()

# ---------------- Center Window ---------------- #

window.update()

window_width = window.winfo_width()
window_height = window.winfo_height()

screen_width = window.winfo_screenwidth()
screen_height = window.winfo_screenheight()

x = int((screen_width - window_width) / 2)
y = int((screen_height - window_height) / 2)

window.geometry(f"{window_width}x{window_height}+{x}+{y}")

window.mainloop();2