

def is_int(s):
    try:
        int(s, 10)
    except ValueError:
        return False
    else:
        return True

color_dic = {"black":"\033[30m", "red":"\033[31m", "green":"\033[32m", "yellow":"\033[33m", "blue":"\033[34m", "end":"\033[0m"}
def print_color(text, color):
    print(color_dic[color] + text + color_dic["end"])
