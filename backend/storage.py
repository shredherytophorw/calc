"""Simple in-memory storage for prototype."""
HISTORY = []
NOTES = ''

def add_history(entry: str):
    HISTORY.insert(0, entry)

def get_history():
    return list(HISTORY)

def get_notes():
    return NOTES

def set_notes(s: str):
    global NOTES
    NOTES = s
