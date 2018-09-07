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

var date_diff_days = function (start, end) {
    return (end.getTime() - start.getTime()) / 1000 / 60 / 60 / 24;
};

// var datetime_to_iso_8601 = function (datetime) {
//     var year = datetime.getFullYear();
//     var month = left_padding_zero((datetime.getMonth() + 1));
//     var day = left_padding_zero(datetime.getDate());
//     var hour = left_padding_zero(datetime.getHours());
//     var min = left_padding_zero(datetime.getMinutes());
//     var sec = left_padding_zero(datetime.getSeconds());
//     return year + '-' + month + '-' + day + 'T' + hour + ':' + min + ':' + sec;
// };

var datetime_to_date = function (datetime) {
    var year = datetime.getFullYear();
    var month = left_padding_zero((datetime.getMonth() + 1));
    var day = left_padding_zero(datetime.getDate());
    return new Date(year + '-' + month + '-' + day + ' 00:00:00');
};

var datetime_to_date_str = function (datetime) {
    var year = datetime.getFullYear();
    var month = left_padding_zero((datetime.getMonth() + 1));
    var day = left_padding_zero(datetime.getDate());
    return year + '-' + month + '-' + day;
};

var left_padding_zero = function (int) {
    return int < 10 ? '0' + int : int;
};


$.ajaxSetup({
    error: function (x, status, error) {
        if (x.status === 403) {
            alert('Sorry, exceeds github api rate limit, you can specify a access_token, visit https://github.com/pingao777/github-gazer for more detail');
        }
        else {
            alert('Error occurred: ' + status + ', Error: ' + error);
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