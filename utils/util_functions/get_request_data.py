def get_request_body(request, parameter_name, parameter_type):
    return parse_input(request.data.get(parameter_name), parameter_type)


def parse_input(input_str, data_type):
    if input_str == None:
        return None
    try:
        parsed_input = data_type(input_str)
        return parsed_input
    except ValueError:
        print("Error: could not parse input as", data_type.__name__)
        return None