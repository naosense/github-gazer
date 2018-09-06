var parse_query = function (query_string) {

    if (is_empty(query_string)) {
        return {};
    }
    var query = {};
    query_string = query_string.charAt(0) === '?' ? query_string.substring(1) : query_string;
    console.log(query_string);
    var query_array = query_string.split('&');
    for (var i in query_array) {
        var kv = query_array[i].split('=');
        console.log(kv);
        query[kv[0]] = kv[1];
    }
    return query;

};

var is_empty = function (s) {
    return s === null || s === undefined || s === '';
};


$.ajaxSetup({
    error: function (x, status, error) {
        if (x.status === 403) {
            alert("Sorry, exceeds github api rate limit, visit https://developer.github.com/v3/rate_limit/ for detail");
        }
        else {
            alert("An error occurred: " + status + "nError: " + error);
        }
    }
});

var query_github_api = function (url) {
    var result = {};
    $.ajax({
        headers: {
            Accept: 'application/vnd.github.v3.star+json; charset=utf-8'
        },
        url: url,
        dataType: 'json',
        type: 'get',
        async: false,
        success: function (data) {
            result = data;
        }
    });

    return result;
};