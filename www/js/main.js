var data = [];
var ready;
var urlVars = getUrlVars();

$(document).ready(function () {
    var id = 'system.host.banana.mem';

    var socket = io.connect();

    console.log(urlVars);

    //var dps = urlVars.dp.split(',');

    socket.on('stateChange', function (changeId, state) {
        if (!ready) return;
        if (changeId === id) {
            //data.push({x: state.ts, y: state.val});
            //graph.update();
            console.log('update!');
        }
    });

    socket.emit('getObject', id, function (err, res) {
        var name = id;
        var unit = '';

        if (!err && res.common) {
            name = res.common.name + ' (' + id + ')';
            unit = res.common.unit;
        }


        console.log('getStateHistory');
        socket.emit('getStateHistory', id, function (err, res) {
            console.log(err, res);

            for (var i = res.length - 1; i >= 0; i--) {
                data.push([res[i].ts * 1000, parseFloat(res[i].val)]);
            }

            console.log(data);

            initChart();

        });

    });


});

function initChart() {
    console.log('initChart');

    Highcharts.setOptions({
        global: {
            //timezoneOffset: getTimezoneOffset()
        }
    });

    $('#chart_container').highcharts('StockChart', {


        rangeSelector : {
            selected : 1,
            inputEnabled: $('#chart_container').width() > 480
        },

        title: {
            text : 'AAPL Stock Price'
        },

        series: [{
            name: 'AAPL',
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
}


function getUrlVars() {
    var vars = {}, hash;
    if (window.location.href.indexOf('?') == -1) { return {}; }
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        if (hash[0] && hash[0] != "") {
            vars[hash[0]] = hash[1];
        }
    }
    return vars;
}
