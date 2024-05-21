def get_request_body(request, parameter_name, parameter_type):
    return parse_input(request.data.get(parameter_name), parameter_type)


def get_request_params(request, parameter_name, parameter_type):
    return parse_input(request.GET.get(parameter_name), parameter_type)

def parse_input(input_str, data_type):
    if input_str == None:
        return None
    try:
        parsed_input = data_type(input_str)
        return parsed_input
    except ValueError:
        print("Error: could not parse input as", data_type.__name__)
        return None
    

def parse_queryparams_to_int_list(queryList):
    queryList = queryList.split(",") if queryList else []
    try:
        queryList = [int(i) for i in queryList]
    except ValueError:
        queryList = []
    return queryList

def parse_queryparams_to_string_list(queryList):
    queryList = queryList.split(",") if queryList else []
    try:
        queryList = [str(i) for i in queryList]
    except ValueError:
        queryList = []
    return queryList