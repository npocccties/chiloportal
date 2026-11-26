def is_int(s):
    try:
        int(s, 10)
    except ValueError:
        return False
    else:
        return True


def str_to_bool(value):
    """文字列を真偽値にする。Python 3.12 で廃止された distutils.util.strtobool と同じ値を受け付ける（前後の空白は無視する）。"""
    normalized = value.strip().lower()
    if normalized in ("y", "yes", "t", "true", "on", "1"):
        return True
    if normalized in ("n", "no", "f", "false", "off", "0"):
        return False
    raise ValueError(f"invalid truth value {value!r}")
