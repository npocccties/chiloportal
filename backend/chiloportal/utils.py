def is_int(s):
    try:
        int(s, 10)
    except ValueError:
        return False
    else:
        return True
