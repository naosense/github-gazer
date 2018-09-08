$(document).ready(function(){
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

    var display_star_chart = function (q, data) {
        var myChart = echarts.init(document.getElementById('star-chart'), 'dark');

        var option = {
            backgroundColor: 'rgba(0,0,0,0.0)',

            title: {
                text: 'Stargazers Trend',
                subtext: q,
                sublink: 'https://github.com/' + q,
                left: '10%',  // 不要用right，否则副标题不显示
                top: '1%'  // 不要用bottom，否则副标题不显示
            },
            tooltip: {trigger: 'axis'},
            grid: {},
            xAxis: {
                type: 'time',
                axisLine: {onZero: false},
                axisLabel: {
                    formatter: function (value, index) {
                        var date = new Date(value);
                        var texts = [date.getFullYear(), (date.getMonth() + 1), date.getDate()];
                        return texts.join('-');
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {onZero: false}
            },
            dataZoom: [
                {
                    type: 'slider',
                    xAxisIndex: 0,
                    filterMode: 'empty'
                },
                {
                    type: 'inside',
                    xAxisIndex: 0,
                    filterMode: 'empty'
                }
            ],
            series: [
                {
                    id: 'a',
                    type: 'line',
//                            smooth: true,
                    symbolSize: 0,
                    data: data,
                    color: 'rgba(40,167,69,1.0)',
                    tooltip: {
                        formatter: function (params) {
                            var date = new Date(params.value[0]);
                            return ' （'
                                + date.getFullYear() + '-'
                                + (date.getMonth() + 1) + '-'
                                + date.getDate() + ' '
                                + date.getHours() + ':'
                                + date.getMinutes()
                                + '）<br/>'
                                + params.value[1];
                        }
                    }
                }
            ]
        };


        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option, true);

        return myChart;
    };

    var display_star_watch_fork_chart = function (q, stars_count, watches_count, forks_count) {
        var myChart = echarts.init(document.getElementById('star-watch-fork-chart'), 'dark');
        var option = {
            backgroundColor: 'rgba(0,0,0,0.0)',
            tooltip: {},
            radar: {
                shape: 'circle',
                indicator: [
                    {name: 'Star', max: Math.max(stars_count, watches_count, forks_count)},
                    {name: 'Watch', max: Math.max(stars_count, watches_count, forks_count)},
                    {name: 'Fork', max: Math.max(stars_count, watches_count, forks_count)}
                ],
                splitLine: {
                    lineStyle: {
                        color: [
                            'rgba(45, 234, 148, 0.1)', 'rgba(45, 234, 148, 0.2)',
                            'rgba(45, 234, 148, 0.4)', 'rgba(45, 234, 148, 0.6)',
                            'rgba(45, 234, 148, 0.8)', 'rgba(45, 234, 148, 1)'
                        ].reverse()
                    }
                },
                splitArea: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(45, 234, 148, 0.5)'
                    }
                }
            },
            series: [{
                name: 'Activity',
                type: 'radar',
                symbolSize: 0,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data: [
                    {
                        value: [stars_count, watches_count, forks_count],
                        name: 'Activity'
                    }
                ],
                color: 'rgba(40,167,69,1.0)'

            }]
        };

        myChart.setOption(option);
    };

    var display_follower_following_chart = function (q, follower_count, following_count) {
        var myChart = echarts.init(document.getElementById('follower-following-chart'), 'dark');

        var option = {
            backgroundColor: 'rgba(0,0,0,0.0)',
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c}'
            },
            color: ['#005cc5', '#28a745'],
            series: [
                {
                    name: 'Relation',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: true,
                            formatter: '{b}: {c}'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: true
                        }
                    },
                    data: [
                        {value: follower_count, name: 'Follower'},
                        {value: following_count, name: 'Following'}
                    ]
                }
            ]
        };

        myChart.setOption(option);
    };

    var display_commit_chart = function (q, start, end, commmits) {
        var myChart = echarts.init(document.getElementById('commit-chart'), 'dark');

        var option = {
            backgroundColor: 'rgba(0,0,0,0.0)',
            title: {
                text: 'Repository Commits (' + datetime_to_date_str(start) + ' ~ ' + datetime_to_date_str(end) + ')',
                left: '10%',  // 不要用right，否则副标题不显示
                top: '1%'  // 不要用bottom，否则副标题不显示
            },
            tooltip: {
                position: 'top',
                formatter: function (params) {
                    var date = new Date(params.value[0]);
                    return date.getFullYear() + '-'
                        + (date.getMonth() + 1) + '-'
                        + date.getDate() + '<br/>'
                        + params.value[1];
                }
            },
            visualMap: {
                show: false,
                min: 0,
                max: 10,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                top: 'top',
                inRange: {
                    color: ['#4A4A4A', '#c6e48b', '#7bc96f', '#239a3b', '#196127']
                }
            },

            calendar: [
                {
                    range: [start, end],
                    cellSize: [15, 15],
                    splitLine: {
                        show: false
                    },
                    itemStyle: {
                        borderWidth: 2,
                        borderColor: '#000'
                    },
                    dayLabel: {
                        color: '#eeeeee'
                    },
                    monthLabel: {
                        color: '#eeeeee'
                    },
                    yearLabel: {
                        show: false
                    }

                }],

            series: [{
                type: 'heatmap',
                coordinateSystem: 'calendar',
                calendarIndex: 0,
                data: commmits
            }]

        };

        myChart.setOption(option);
    };


    var query = parse_query(window.location.search);
    var q = is_empty(query['q']) ? 'pingao777/markdown-preview-sync' : query['q'];
    var access_token = is_empty(query['access_token']) ? '' : query['access_token'];

    var get_stargazers = function (q, access_token) {
        var get_stargazers_count = function (q, access_token) {
            var stargazers_count = 0;
            var user = q.split('/')[0];
            var repo = q.split('/')[1];
            var url = 'https://api.github.com/search/repositories?q=user:' + user + '+repo:' + repo + '+' + repo
                + (is_empty(access_token) ? '' : '&access_token=' + access_token);
            var result = query_github_api(url);

            if (result.length !== 0) {
                stargazers_count = result['items'][0]['stargazers_count'];
            }

            return stargazers_count;
        };



        var stargazers = [];
        var star_chart = display_star_chart(q, stargazers);
        var stargazers_count = get_stargazers_count(q, access_token);


        var page = 1;
        var page_size = 100;
        var url = 'https://api.github.com/repos/' + q + '/stargazers?per_page=' + page_size + '&page=' + page
            + (is_empty(access_token) ? '' : '&access_token=' + access_token);
        var result = query_github_api(url);

        while (result.length !== 0) {
            var stargazers_per_page = result.map(function (e, i) {
                return [e.starred_at, i + 1 + (page - 1) * 100]
            });
            stargazers = stargazers.concat(stargazers_per_page);


            // star_chart.setOption({
            //     series: [{
            //         data: stargazers
            //     }]
            // });
            var progress = stargazers.length / stargazers_count * 100;
            console.log('stargazers_count ' + stargazers_count);
            console.log('p ' + progress);
            if (progress >= 100) {
//                            $('#progress-bar').hide();
            } else {
                $('#progress-bar').text(progress + '%');
            }
            page++;
            url = 'https://api.github.com/repos/' + q + '/stargazers?per_page=' + page_size + '&page=' + page
                + (is_empty(access_token) ? '' : '&access_token=' + access_token);
            result = query_github_api(url);
        }

        return stargazers;
    };



    var render_follower_following_chart = function (q, access_token) {
        var follower_count = 0;
        var following_count = 0;
        var user = q.split('/')[0];
        var url = 'https://api.github.com/users/' + user
            + (is_empty(access_token) ? '' : '?access_token=' + access_token);
        var result = query_github_api(url);

        if (result.length !== 0) {
            follower_count = result['followers'];
            following_count = result['following'];
        }

        display_follower_following_chart(q, follower_count, following_count);
    };

    var render_star_watch_fork_chart = function (q, access_token) {
        var get_forks_count = function (q, access_token) {
            var forks_count = 0;
            var user = q.split('/')[0];
            var repo = q.split('/')[1];
            var url = 'https://api.github.com/search/repositories?q=user:' + user + '+repo:' + repo + '+' + repo
                + (is_empty(access_token) ? '' : '&access_token=' + access_token);
            var result = query_github_api(url);

            if (result.length !== 0) {
                forks_count = result['items'][0]['forks_count'];
            }

            return forks_count;
        };

        var get_watches_count = function (q, access_token) {
            var watches_count = 0;
            var page = 1;
            var page_size = 100;
            var url = 'https://api.github.com/repos/' + q + '/subscribers?per_page=' + page_size + '&page=' + page
                + (is_empty(access_token) ? '' : '&access_token=' + access_token);
            var result = query_github_api(url);

            while (result.length !== 0) {
                watches_count += result.length;
                page++;
                url = 'https://api.github.com/repos/' + q + '/subscribers?per_page=' + page_size + '&page=' + page
                    + (is_empty(access_token) ? '' : '&access_token=' + access_token);
                result = query_github_api(url);
            }

            return watches_count;
        };

        var watches_count = get_watches_count(q, access_token);
        var forks_count = get_forks_count(q, access_token);

        display_star_watch_fork_chart(q, stargazers.length, watches_count, forks_count);

    };

    var render_commit_chart = function (q, access_token) {
        var mill_sec_one_day = 24 * 3600 * 1000;
        var commits = new Array(365);
        var now = new Date();
        var today = datetime_to_date(now);
        var one_year_ago = new Date(today.getTime() - 364 * mill_sec_one_day);
        for (var i = 0; i < commits.length; i++) {
            commits[i] = 0;
        }
        var url = 'https://api.github.com/repos/' + q + '/commits?since=' + one_year_ago.toISOString()
            + (is_empty(access_token) ? '' : '&access_token=' + access_token);
        var result = query_github_api(url);

        if (result.length !== 0) {
            var commits_time = result.map(function (e) {
                return e.commit.committer.date;
            });

            for (var j in commits_time) {
                commits[Math.floor(date_diff_days(one_year_ago, new Date(commits_time[j])))] += 1;
            }

            commits = commits.map(function (e, i) {
                return [new Date(one_year_ago.getTime() + i * mill_sec_one_day).toISOString(), commits[i]];
            });
        }
        display_commit_chart(q, one_year_ago, today, commits);
    };


    //        var stargazers = [1, 2];
    if ($('#progress-bar').length) {
        var stargazers = get_stargazers(q, access_token);
        render_star_watch_fork_chart(q, access_token);
        render_follower_following_chart(q, access_token);
        render_commit_chart(q, access_token)
    }

});