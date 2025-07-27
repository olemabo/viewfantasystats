def parseStringToInt(value):
    try:
        int_value = int(value)
        return int_value
    except ValueError:
        return 0